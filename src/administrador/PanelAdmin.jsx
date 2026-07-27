import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicios/api';
import Dashboard from './Dashboard';
import CatalogoPlataformas from './CatalogoPlataformas';
import GestionUsuarios from './GestionUsuarios';
import MiPerfil from './MiPerfil';

function PanelAdmin() {
    const [vistaActual, asignarVistaActual] = useState('Métricas');
    const [plataformas, asignarPlataformas] = useState([]);
    const [usuarios, asignarUsuarios] = useState([]);
    const [miPerfil, asignarMiPerfil] = useState({ name: '', email: '' });

    const [mostrarModal, asignarMostrarModal] = useState(false);
    const [nombrePlataforma, asignarNombrePlataforma] = useState('');
    const [categoriaPlataforma, asignarCategoriaPlataforma] = useState('');
    const [archivoLogo, asignarArchivoLogo] = useState(null);
    const [previsualizacionLogo, asignarPrevisualizacionLogo] = useState(null);
    const [error, asignarError] = useState('');

    const [mostrarModalUsuario, asignarMostrarModalUsuario] = useState(false);
    const [nombreUsuario, asignarNombreUsuario] = useState('');
    const [correoUsuario, asignarCorreoUsuario] = useState('');
    const [passwordUsuario, asignarPasswordUsuario] = useState('');
    const [rolIdUsuario, asignarRolIdUsuario] = useState('2');
    const [errorUsuario, asignarErrorUsuario] = useState('');

    const navegar = useNavigate();

    useEffect(() => {
        obtenerDatosPerfil();
        if (vistaActual === 'Plataformas') obtenerPlataformas();
        if (vistaActual === 'Usuarios') obtenerUsuarios();
    }, [vistaActual]);

    const obtenerDatosPerfil = async () => {
        try {
            const respuesta = await api.get('/user');
            asignarMiPerfil(respuesta.data);
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

    const obtenerUsuarios = async () => {
        try {
            const respuesta = await api.get('/usuarios');
            asignarUsuarios(respuesta.data.data);
        } catch (falla) {
            console.error('Aún no existe la ruta de usuarios en el backend');
        }
    };

    const manejarCambioLogo = (evento) => {
        const archivo = evento.target.files[0];
        asignarArchivoLogo(archivo || null);
        asignarPrevisualizacionLogo(archivo ? URL.createObjectURL(archivo) : null);
    };

    const guardarPlataforma = async (evento) => {
        evento.preventDefault();
        asignarError('');

        try {
            const datosFormulario = new FormData();
            datosFormulario.append('nombre', nombrePlataforma);
            datosFormulario.append('categoria', categoriaPlataforma);
            if (archivoLogo) {
                datosFormulario.append('logo', archivoLogo);
            }

            await api.post('/plataformas', datosFormulario, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            asignarNombrePlataforma('');
            asignarCategoriaPlataforma('');
            asignarArchivoLogo(null);
            asignarPrevisualizacionLogo(null);
            asignarMostrarModal(false);
            obtenerPlataformas();
        } catch (falla) {
            asignarError('Error al guardar la plataforma');
        }
    };

    const cerrarModalPlataforma = () => {
        asignarMostrarModal(false);
        asignarArchivoLogo(null);
        asignarPrevisualizacionLogo(null);
    };

    const eliminarPlataforma = async (id) => {
        try {
            await api.delete(`/plataformas/${id}`);
            obtenerPlataformas();
        } catch (falla) {
            console.error(falla);
        }
    };

    const guardarUsuario = async (evento) => {
        evento.preventDefault();
        asignarErrorUsuario('');

        try {
            await api.post('/usuarios', {
                name: nombreUsuario,
                email: correoUsuario,
                password: passwordUsuario,
                rol_id: rolIdUsuario
            });

            asignarNombreUsuario('');
            asignarCorreoUsuario('');
            asignarPasswordUsuario('');
            asignarRolIdUsuario('2');
            asignarMostrarModalUsuario(false);
            obtenerUsuarios();
        } catch (falla) {
            asignarErrorUsuario('Error al guardar el usuario');
        }
    };

    const eliminarUsuario = async (id) => {
        const confirmar = window.confirm('¿Estás seguro de eliminar este usuario del sistema?');
        if (confirmar) {
            try {
                await api.delete(`/usuarios/${id}`);
                obtenerUsuarios();
            } catch (falla) {
                console.error(falla);
            }
        }
    };

    const cerrarSesion = async () => {
        try {
            await api.post('/logout');
        } catch (falla) {
            console.error(falla);
        } finally {
            sessionStorage.removeItem('token_acceso');
            sessionStorage.removeItem('rol_id');
            navegar('/');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">

            <aside className="w-64 bg-[#43a047] text-white flex flex-col justify-between shadow-xl z-10">
                <div>
                    <div className="p-6 flex flex-col items-center border-b border-white/20">
                        <div className="w-28 h-28 mb-3 overflow-hidden rounded-full flex items-center justify-center drop-shadow-md">
                            <img src="/logo.png" alt="Logo Gastómetro" className="w-full h-full object-cover scale-150" />
                        </div>
                        <h1 className="text-lg font-bold tracking-wider text-center">GASTOMETRO</h1>
                        <span className="text-xs bg-white text-[#43a047] px-2 py-0.5 rounded mt-1 font-bold">ADMIN</span>
                    </div>
                    <nav className="flex flex-col mt-6 gap-2 px-4">
                        <button onClick={() => asignarVistaActual('Métricas')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Métricas' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Métricas' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Dashboard
                        </button>
                        <button onClick={() => asignarVistaActual('Plataformas')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Plataformas' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Plataformas' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Catálogo plataformas
                        </button>
                        <button onClick={() => asignarVistaActual('Usuarios')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Usuarios' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Usuarios' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Gestión usuarios
                        </button>
                        <button onClick={() => asignarVistaActual('Configuracion')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Configuracion' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Configuracion' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Mi perfil
                        </button>
                    </nav>
                </div>
                <div className="p-4 border-t border-white/20 flex justify-between items-center bg-black/10">
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold truncate">{miPerfil.name || 'Cargando...'}</span>
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
                        <span className="font-bold text-[#4ade80] tracking-widest hidden md:block w-40">{vistaActual.toUpperCase()}</span>
                        <div className="flex w-full max-w-md">
                            <input type="text" placeholder="Buscar en el sistema..." className="flex-1 px-3 py-1.5 bg-white text-black rounded-l-sm outline-none text-sm" />
                            <button className="bg-[#43a047] px-4 py-1.5 font-semibold text-sm rounded-r-sm hover:bg-[#388e3c] transition-colors">Buscar</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        <span className="font-semibold text-[#4ade80] text-sm md:text-base hidden sm:block">Panel de Control</span>
                    </div>
                </header>

                <div className="p-8 md:p-12 overflow-y-auto flex-1">

                    {vistaActual === 'Métricas' && (
                        <Dashboard plataformas={plataformas} usuarios={usuarios} />
                    )}

                    {vistaActual === 'Plataformas' && (
                        <CatalogoPlataformas
                            plataformas={plataformas}
                            asignarMostrarModal={asignarMostrarModal}
                            eliminarPlataforma={eliminarPlataforma}
                        />
                    )}

                    {vistaActual === 'Usuarios' && (
                        <GestionUsuarios
                            usuarios={usuarios}
                            eliminarUsuario={eliminarUsuario}
                            asignarMostrarModalUsuario={asignarMostrarModalUsuario}
                        />
                    )}

                    {vistaActual === 'Configuracion' && (
                        <MiPerfil miPerfil={miPerfil} />
                    )}

                </div>
            </main>

            {mostrarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-fade-in-up">
                        <h2 className="text-xl font-bold text-center text-[#43a047] border-b pb-3 uppercase tracking-wide">Registrar Plataforma</h2>

                        {error && <p className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded border border-red-100">{error}</p>}

                        <form onSubmit={guardarPlataforma} className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nombre de la plataforma</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Disney+, Notion, AWS"
                                    value={nombrePlataforma}
                                    onChange={(e) => asignarNombrePlataforma(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Streaming, Trabajo"
                                    value={categoriaPlataforma}
                                    onChange={(e) => asignarCategoriaPlataforma(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Logo de la plataforma</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                                    onChange={manejarCambioLogo}
                                    className="p-2 border border-gray-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#43a047] file:text-white file:font-semibold file:cursor-pointer"
                                />
                                {previsualizacionLogo && (
                                    <img
                                        src={previsualizacionLogo}
                                        alt="Previsualización del logo"
                                        className="w-20 h-20 object-cover rounded-lg mt-2 border border-gray-200 mx-auto"
                                    />
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={cerrarModalPlataforma} className="flex-1 bg-gray-200 text-gray-700 p-2.5 rounded-xl font-bold hover:bg-gray-300 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 bg-[#43a047] text-white p-2.5 rounded-xl font-bold hover:bg-[#388e3c] shadow-md transition-all">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarModalUsuario && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-fade-in-up">
                        <h2 className="text-xl font-bold text-center text-[#43a047] border-b pb-3 uppercase tracking-wide">Registrar Usuario</h2>

                        {errorUsuario && <p className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded border border-red-100">{errorUsuario}</p>}

                        <form onSubmit={guardarUsuario} className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Juan Pérez"
                                    value={nombreUsuario}
                                    onChange={(e) => asignarNombreUsuario(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Correo Electrónico</label>
                                <input
                                    type="email"
                                    placeholder="Ej. juan@correo.com"
                                    value={correoUsuario}
                                    onChange={(e) => asignarCorreoUsuario(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={passwordUsuario}
                                    onChange={(e) => asignarPasswordUsuario(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Rol</label>
                                <select
                                    value={rolIdUsuario}
                                    onChange={(e) => asignarRolIdUsuario(e.target.value)}
                                    required
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none bg-white font-medium"
                                >
                                    <option value="1">Administrador</option>
                                    <option value="2">Cliente</option>
                                    <option value="3">Cazaofertas</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => asignarMostrarModalUsuario(false)} className="flex-1 bg-gray-200 text-gray-700 p-2.5 rounded-xl font-bold hover:bg-gray-300 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 bg-[#43a047] text-white p-2.5 rounded-xl font-bold hover:bg-[#388e3c] shadow-md transition-all">
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

export default PanelAdmin;
