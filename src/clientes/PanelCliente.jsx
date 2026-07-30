import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../servicios/api';
import Inicio from './Inicio';
import Suscripciones from './Suscripciones';
import Promociones from './Promociones';
import Configuracion from './Configuracion';

function PanelCliente() {
    const [vistaActual, asignarVistaActual] = useState('Inicio');
    const [plataformas, asignarPlataformas] = useState([]);
    const [misSuscripciones, asignarMisSuscripciones] = useState([]);
    const [promociones, asignarPromociones] = useState([]);
    const [usuario, asignarUsuario] = useState({ name: '', email: '', telefono: '', presupuesto: '' });

    const [mostrarModal, asignarMostrarModal] = useState(false);
    const [plataformaSeleccionada, asignarPlataformaSeleccionada] = useState('');
    const [costo, asignarCosto] = useState('');
    const [diaCorte, asignarDiaCorte] = useState('');
    const [error, asignarError] = useState('');

    // Nuevo: control del menú lateral en móvil (tipo "hamburguesa")
    const [menuMovilAbierto, asignarMenuMovilAbierto] = useState(false);

    const navegar = useNavigate();

    const preciosBase = {
        'Netflix': 219.00,
        'Spotify': 129.00,
        'Amazon Prime': 99.00,
        'Disney+': 179.00,
        'Max': 149.00,
        'YouTube Premium': 139.00,
        'Crunchyroll': 119.00
    };

    useEffect(() => {
        obtenerDatosUsuario();
        obtenerPlataformas();
        obtenerMisSuscripciones();
        obtenerPromociones();
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const respuesta = await api.get('/user');
            asignarUsuario(respuesta.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const obtenerPlataformas = async () => {
        try {
            const respuesta = await api.get('/plataformas');
            asignarPlataformas(respuesta.data.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const obtenerMisSuscripciones = async () => {
        try {
            const respuesta = await api.get('/mis-suscripciones');
            asignarMisSuscripciones(respuesta.data.data || respuesta.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const obtenerPromociones = async () => {
        try {
            const respuesta = await api.get('/promociones');
            // Algunas respuestas vienen como { data: [...] } y otras como el arreglo directo
            asignarPromociones(respuesta.data.data ?? respuesta.data ?? []);
        } catch (falla) {
            console.error(falla);
            asignarPromociones([]);
        }
    };

    const manejarSeleccionPlataforma = (evento) => {
        const idPlataforma = evento.target.value;
        asignarPlataformaSeleccionada(idPlataforma);

        const plataformaEncontrada = plataformas.find(p => p.id.toString() === idPlataforma);

        if (plataformaEncontrada && preciosBase[plataformaEncontrada.nombre]) {
            asignarCosto(preciosBase[plataformaEncontrada.nombre]);
        } else {
            asignarCosto('');
        }
    };

    const agregarSuscripcion = async (evento) => {
        evento.preventDefault();
        asignarError('');

        try {
            await api.post('/mis-suscripciones', {
                plataforma_id: plataformaSeleccionada,
                costo_personalizado: costo,
                dia_corte: diaCorte
            });

            asignarPlataformaSeleccionada('');
            asignarCosto('');
            asignarDiaCorte('');
            asignarMostrarModal(false);
            obtenerMisSuscripciones();

        } catch (falla) {
            asignarError('Error al guardar la suscripción');
        }
    };

    const eliminarSuscripcion = async (id, nombre) => {
        const resultado = await Swal.fire({
            title: '¿Cancelar suscripción?',
            text: nombre ? `Vas a cancelar tu suscripción a ${nombre}. Esta acción no se puede deshacer.` : 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3EA341',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Volver',
            reverseButtons: true,
        });

        if (!resultado.isConfirmed) return;

        try {
            await api.delete(`/mis-suscripciones/${id}`);
            obtenerMisSuscripciones();
            Swal.fire({
                title: 'Cancelada',
                text: 'Tu suscripción se canceló correctamente.',
                icon: 'success',
                confirmButtonColor: '#3EA341',
                timer: 2000,
                timerProgressBar: true,
            });
        } catch (falla) {
            console.error(falla);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cancelar la suscripción. Intenta de nuevo.',
                icon: 'error',
                confirmButtonColor: '#3EA341',
            });
        }
    };

    const cerrarSesion = async () => {
        try {
            await api.post('/logout');
        } catch (falla) {
            console.error(falla);
        } finally {
            sessionStorage.removeItem('token_acceso');
            navegar('/');
        }
    };

    const cambiarVista = (vista) => {
        asignarVistaActual(vista);
        asignarMenuMovilAbierto(false);
    };

    const totalGasto = misSuscripciones.reduce((suma, sub) => suma + parseFloat(sub.pivot.costo_personalizado), 0);
    const tieneSuscripciones = misSuscripciones.length > 0;

    const elementosNav = [
        { clave: 'Inicio', etiqueta: 'Inicio' },
        { clave: 'Suscripciones', etiqueta: 'Suscripciones' },
        { clave: 'Promociones', etiqueta: 'Promociones' },
        { clave: 'Configuracion', etiqueta: 'Configuración' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">

            {menuMovilAbierto && (
                <div
                    onClick={() => asignarMenuMovilAbierto(false)}
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                />
            )}

            <aside
                className={`fixed md:static top-0 left-0 h-screen md:h-auto w-64 bg-[#43a047] text-white flex flex-col justify-between shadow-xl z-30 transform transition-transform duration-300 ease-in-out
                ${menuMovilAbierto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div>
                    <div className="p-6 flex flex-col items-center border-b border-white/20 relative">
                        <button
                            onClick={() => asignarMenuMovilAbierto(false)}
                            className="absolute top-4 right-4 text-white/80 hover:text-white md:hidden"
                            aria-label="Cerrar menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="w-28 h-28 mb-3 overflow-hidden rounded-full flex items-center justify-center drop-shadow-md">
                            <img src="/logo.png" alt="Logo Gastómetro" className="w-full h-full object-cover scale-150" />
                        </div>
                        <h1 className="text-xl font-bold tracking-wider text-center">GASTOMETRO</h1>
                    </div>
                    <nav className="flex flex-col mt-6 gap-2 px-4">
                        {elementosNav.map((item) => (
                            <button
                                key={item.clave}
                                onClick={() => cambiarVista(item.clave)}
                                className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === item.clave ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            >
                                <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${vistaActual === item.clave ? 'bg-white' : 'bg-white/70'}`}></div>
                                {item.etiqueta}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-black text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-10">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Botón hamburguesa, solo visible en móvil */}
                        <button
                            onClick={() => asignarMenuMovilAbierto(true)}
                            className="md:hidden text-white p-1 -ml-1"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="font-bold text-[#4ade80] tracking-widest uppercase truncate">{vistaActual}</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="hidden sm:flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            <span className="font-semibold text-white text-sm truncate max-w-[10rem]">{usuario.name || 'Cargando...'}</span>
                        </div>
                        <button
                            onClick={cerrarSesion}
                            className="bg-[#3EA341] hover:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-6 md:p-12 overflow-y-auto flex-1 min-h-0">

                    {vistaActual === 'Inicio' && (
                        <Inicio
                            usuario={usuario}
                            misSuscripciones={misSuscripciones}
                            tieneSuscripciones={tieneSuscripciones}
                            totalGasto={totalGasto}
                            asignarMostrarModal={asignarMostrarModal}
                        />
                    )}

                    {vistaActual === 'Suscripciones' && (
                        <Suscripciones
                            misSuscripciones={misSuscripciones}
                            totalGasto={totalGasto}
                            asignarMostrarModal={asignarMostrarModal}
                            eliminarSuscripcion={eliminarSuscripcion}
                        />
                    )}

                    {vistaActual === 'Promociones' && (
                        <Promociones promociones={promociones} />
                    )}

                    {vistaActual === 'Configuracion' && (
                        <Configuracion usuario={usuario} asignarUsuario={asignarUsuario} />
                    )}

                </div>
            </main>

            {mostrarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in-up flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-center text-gray-800 border-b pb-3">Registrar gasto</h2>

                        {error && <p className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded">{error}</p>}

                        <form onSubmit={agregarSuscripcion} className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Plataforma</label>
                                <select
                                    value={plataformaSeleccionada}
                                    onChange={manejarSeleccionPlataforma}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none bg-white font-medium"
                                >
                                    <option value="">Selecciona plataforma...</option>
                                    {plataformas.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>

                                {(() => {
                                    const plataformaElegida = plataformas.find(p => p.id.toString() === plataformaSeleccionada);
                                    return plataformaElegida?.logo_url ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <img src={plataformaElegida.logo_url} alt={plataformaElegida.nombre} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                                            <span className="text-sm text-gray-600 font-medium">{plataformaElegida.nombre}</span>
                                        </div>
                                    ) : null;
                                })()}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Costo mensual ($)</label>
                                <input
                                    type="number" step="0.01" placeholder="Ej. 129.00"
                                    value={costo} onChange={(e) => asignarCosto(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Día de cobro</label>
                                <input
                                    type="number" min="1" max="31" placeholder="Del 1 al 31"
                                    value={diaCorte} onChange={(e) => asignarDiaCorte(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => asignarMostrarModal(false)} className="flex-1 bg-gray-200 text-gray-700 p-2.5 rounded-xl font-bold hover:bg-gray-300 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 bg-[#4ade80] text-white p-2.5 rounded-xl font-bold hover:bg-[#3ee075] shadow-md transition-all">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PanelCliente;