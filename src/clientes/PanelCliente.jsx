import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            asignarPromociones(respuesta.data.data);
        } catch (falla) {
            console.error(falla);
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

    const eliminarSuscripcion = async (id) => {
        try {
            await api.delete(`/mis-suscripciones/${id}`);
            obtenerMisSuscripciones();
        } catch (falla) {
            console.error(falla);
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

    const totalGasto = misSuscripciones.reduce((suma, sub) => suma + parseFloat(sub.pivot.costo_personalizado), 0);
    const tieneSuscripciones = misSuscripciones.length > 0;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">

            <aside className="w-64 bg-[#43a047] text-white flex flex-col justify-between shadow-xl z-10">
                <div>
                    <div className="p-6 flex flex-col items-center border-b border-white/20">
                        <div className="w-28 h-28 mb-3 overflow-hidden rounded-full flex items-center justify-center drop-shadow-md">
                            <img src="/logo.png" alt="Logo Gastómetro" className="w-full h-full object-cover scale-150" />
                        </div>                        <h1 className="text-xl font-bold tracking-wider text-center">GASTOMETRO</h1>
                    </div>
                    <nav className="flex flex-col mt-6 gap-2 px-4">
                        <button onClick={() => asignarVistaActual('Inicio')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Inicio' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Inicio' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Inicio
                        </button>
                        <button onClick={() => asignarVistaActual('Suscripciones')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Suscripciones' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Suscripciones' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Suscripciones
                        </button>
                        <button onClick={() => asignarVistaActual('Promociones')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Promociones' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Promociones' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Promociones
                        </button>
                        <button onClick={() => asignarVistaActual('Configuracion')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Configuracion' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Configuracion' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Configuración
                        </button>
                    </nav>
                </div>
                <div className="p-4 border-t border-white/20 flex justify-between items-center bg-black/10">
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">{usuario.name || 'Cargando...'}</span>
                        <span className="text-xs text-white/80 hover:text-white text-left">Cerrar sesión</span>
                    </div>
                    <button onClick={cerrarSesion} className="bg-white text-[#43a047] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shadow-sm ml-2">
                        <span className="font-bold text-lg leading-none">←</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-black text-white flex items-center justify-between px-6 shadow-md z-0">
                    <div className="flex items-center gap-4 w-2/3">
                        <span className="font-bold text-[#4ade80] tracking-widest hidden md:block w-32">{vistaActual.toUpperCase()}</span>
                        <div className="flex w-full max-w-md">
                            <input type="text" placeholder="Buscar en el sistema..." className="flex-1 px-3 py-1.5 bg-white text-black rounded-l-sm outline-none text-sm" />                            <button className="bg-[#43a047] px-4 py-1.5 font-semibold text-sm rounded-r-sm hover:bg-[#388e3c] transition-colors">Buscar</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        <span className="font-semibold text-[#4ade80] text-sm md:text-base hidden sm:block">{usuario.name}</span>
                    </div>
                </header>

                <div className="p-8 md:p-12 overflow-y-auto flex-1">

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
                        <Configuracion usuario={usuario} />
                    )}

                </div>
            </main>

            {mostrarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in-up flex flex-col gap-4">
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
