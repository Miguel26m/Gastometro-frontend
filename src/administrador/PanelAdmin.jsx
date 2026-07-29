import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../servicios/api';
import Dashboard from './Dashboard';
import CatalogoPlataformas from './CatalogoPlataformas';
import GestionUsuarios from './GestionUsuarios';

function PanelAdmin() {
    const [vistaActual, asignarVistaActual] = useState('Métricas');
    const [plataformas, asignarPlataformas] = useState([]);
    const [usuarios, asignarUsuarios] = useState([]);
    const [miPerfil, asignarMiPerfil] = useState({ name: '', email: '' });

    const [mostrarModal, asignarMostrarModal] = useState(false);
    const [nombrePlataforma, asignarNombrePlataforma] = useState('');
    const [categoriaPlataforma, asignarCategoriaPlataforma] = useState('');
    const [precioBasePlataforma, asignarPrecioBasePlataforma] = useState('');
    const [archivoLogo, asignarArchivoLogo] = useState(null);
    const [previsualizacionLogo, asignarPrevisualizacionLogo] = useState(null);
    const [error, asignarError] = useState('');
    const [plataformaEnEdicion, asignarPlataformaEnEdicion] = useState(null);

    const [mostrarModalUsuario, asignarMostrarModalUsuario] = useState(false);
    const [usuarioEnEdicion, asignarUsuarioEnEdicion] = useState(null);
    const [nombreUsuario, asignarNombreUsuario] = useState('');
    const [correoUsuario, asignarCorreoUsuario] = useState('');
    const [passwordUsuario, asignarPasswordUsuario] = useState('');
    const [rolIdUsuario, asignarRolIdUsuario] = useState('2');
    const [errorUsuario, asignarErrorUsuario] = useState('');
    const [telefonoUsuario, asignarTelefonoUsuario] = useState('');
    
   
    const [menuMovilAbierto, asignarMenuMovilAbierto] = useState(false);

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
            const dataUsuarios = respuesta.data.data ? respuesta.data.data : respuesta.data;

            if (Array.isArray(dataUsuarios)) {
                asignarUsuarios(dataUsuarios);
            } else {
                console.error("El formato de datos no es correcto:", respuesta.data);
                asignarUsuarios([]);
            }
        } catch (falla) {
            console.error('Error al contactar la ruta /usuarios del backend:', falla);
        }
    };

    const manejarCambioLogo = (evento) => {
        const archivo = evento.target.files[0];
        asignarArchivoLogo(archivo || null);
        asignarPrevisualizacionLogo(archivo ? URL.createObjectURL(archivo) : null);
    };

    const abrirModalNuevaPlataforma = () => {
        asignarPlataformaEnEdicion(null);
        asignarNombrePlataforma('');
        asignarCategoriaPlataforma('');
        asignarPrecioBasePlataforma('');
        asignarArchivoLogo(null);
        asignarPrevisualizacionLogo(null);
        asignarError('');
        asignarMostrarModal(true);
    };

    const abrirModalEditarPlataforma = (plat) => {
        asignarPlataformaEnEdicion(plat.id);
        asignarNombrePlataforma(plat.nombre);
        asignarCategoriaPlataforma(plat.categoria || '');
        asignarPrecioBasePlataforma(plat.precio_base || '');
        asignarArchivoLogo(null);
        asignarPrevisualizacionLogo(plat.logo_url || null); 
        asignarError('');
        asignarMostrarModal(true);
    };

    const guardarPlataforma = async (evento) => {
        evento.preventDefault();
        asignarError('');

        try {
            const datosFormulario = new FormData();
            datosFormulario.append('nombre', nombrePlataforma);
            datosFormulario.append('categoria', categoriaPlataforma);
            datosFormulario.append('precio_base', precioBasePlataforma);
            
            if (archivoLogo) {
                datosFormulario.append('logo', archivoLogo);
            }

            if (plataformaEnEdicion) {
                datosFormulario.append('_method', 'PUT');
                await api.post(`/plataformas/${plataformaEnEdicion}`, datosFormulario, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('¡Actualizado!', 'La plataforma se actualizó correctamente.', 'success');
            } else {
                await api.post('/plataformas', datosFormulario, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('¡Guardado!', 'La plataforma se registró correctamente.', 'success');
            }

            asignarNombrePlataforma('');
            asignarCategoriaPlataforma('');
            asignarPrecioBasePlataforma('');
            asignarArchivoLogo(null);
            asignarPrevisualizacionLogo(null);
            asignarPlataformaEnEdicion(null);
            asignarMostrarModal(false);
            obtenerPlataformas();
        } catch (falla) {
            console.error(falla);
            asignarError(plataformaEnEdicion ? 'Error al actualizar la plataforma' : 'Error al guardar la plataforma');
        }
    };

    const cerrarModalPlataforma = () => {
        asignarMostrarModal(false);
        asignarArchivoLogo(null);
        asignarPrevisualizacionLogo(null);
        asignarPlataformaEnEdicion(null);
    };

    const eliminarPlataforma = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Se eliminará esta plataforma del catálogo de forma permanente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await api.delete(`/plataformas/${id}`);
                obtenerPlataformas();
                Swal.fire('¡Eliminada!', 'La plataforma ha sido eliminada exitosamente.', 'success');
            } catch (falla) {
                console.error(falla);
                Swal.fire('Error', 'Hubo un problema al eliminar la plataforma.', 'error');
            }
        }
    };

    const abrirModalNuevoUsuario = () => {
        asignarUsuarioEnEdicion(null);
        asignarNombreUsuario('');
        asignarCorreoUsuario('');
        asignarTelefonoUsuario('');
        asignarPasswordUsuario('');
        asignarRolIdUsuario('2');
        asignarErrorUsuario('');
        asignarMostrarModalUsuario(true);
    };

    const abrirModalEditarUsuario = (usuario) => {
        asignarUsuarioEnEdicion(usuario.id);
        asignarNombreUsuario(usuario.name);
        asignarCorreoUsuario(usuario.email);
        asignarTelefonoUsuario(usuario.telefono || '');
        asignarPasswordUsuario(''); 
        asignarRolIdUsuario(usuario.rol_id.toString());
        asignarErrorUsuario('');
        asignarMostrarModalUsuario(true);
    };

    const guardarUsuario = async (evento) => {
        evento.preventDefault();
        asignarErrorUsuario('');

        try {
            const datosUsuario = {
                name: nombreUsuario,
                email: correoUsuario,
                rol_id: parseInt(rolIdUsuario), 
                telefono: telefonoUsuario
            };

            if (passwordUsuario) {
                datosUsuario.password = passwordUsuario;
                datosUsuario.password_confirmation = passwordUsuario; 
            }

            if (usuarioEnEdicion) {
                await api.put(`/usuarios/${usuarioEnEdicion}`, datosUsuario);
                Swal.fire('¡Actualizado!', 'El usuario se actualizó correctamente.', 'success');
            } else {
                await api.post('/usuarios', datosUsuario);
                Swal.fire('¡Registrado!', 'El nuevo usuario se agregó correctamente.', 'success');
            }

            asignarMostrarModalUsuario(false);
            obtenerUsuarios();
        } catch (falla) {
            const mensajeError = falla.response?.data?.message || (usuarioEnEdicion ? 'Error al actualizar el usuario' : 'Error al guardar el usuario');
            asignarErrorUsuario(mensajeError);
        }
    };

    const eliminarUsuario = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: "¡No podrás revertir esto y el usuario perderá acceso al sistema!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await api.delete(`/usuarios/${id}`);
                obtenerUsuarios();
                Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado de la base de datos.', 'success');
            } catch (falla) {
                console.error(falla);
                Swal.fire('Error', 'No se pudo eliminar al usuario. Intenta más tarde.', 'error');
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

    const cambiarVista = (vista) => {
        asignarVistaActual(vista);
        asignarMenuMovilAbierto(false); 
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
            
            {/* Fondo oscuro al abrir el menú en móviles */}
            {menuMovilAbierto && (
                <div
                    onClick={() => asignarMenuMovilAbierto(false)}
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                />
            )}

            {/* Sidebar Responsivo */}
            <aside
                className={`fixed md:static top-0 left-0 h-screen md:h-auto w-64 bg-[#43a047] text-white flex flex-col justify-between shadow-xl z-30 transform transition-transform duration-300 ease-in-out
                ${menuMovilAbierto ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div>
                    <div className="p-6 flex flex-col items-center border-b border-white/20 relative">
                        {/* Botón para cerrar menú móvil */}
                        <button
                            onClick={() => asignarMenuMovilAbierto(false)}
                            className="absolute top-4 right-4 text-white/80 hover:text-white md:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-28 h-28 mb-3 overflow-hidden rounded-full flex items-center justify-center drop-shadow-md">
                            <img src="/logo.png" alt="Logo Gastómetro" className="w-full h-full object-cover scale-150" />
                        </div>
                        <h1 className="text-lg font-bold tracking-wider text-center">GASTOMETRO</h1>
                        <span className="text-xs bg-white text-[#43a047] px-2 py-0.5 rounded mt-1 font-bold">ADMIN</span>
                    </div>
                    <nav className="flex flex-col mt-6 gap-2 px-4">
                        <button onClick={() => cambiarVista('Métricas')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Métricas' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Métricas' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Dashboard
                        </button>
                        <button onClick={() => cambiarVista('Plataformas')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Plataformas' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Plataformas' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Catálogo plataformas
                        </button>
                        <button onClick={() => cambiarVista('Usuarios')} className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Usuarios' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Usuarios' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Gestión usuarios
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-black text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-10">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Botón de hamburguesa para móviles */}
                        <button
                            onClick={() => asignarMenuMovilAbierto(true)}
                            className="md:hidden text-white p-1 -ml-1"
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
                            <span className="font-semibold text-white text-sm truncate max-w-[10rem]">{miPerfil.name || 'Admin'}</span>
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
                    {vistaActual === 'Métricas' && (
                        <Dashboard plataformas={plataformas} usuarios={usuarios} />
                    )}

                    {vistaActual === 'Plataformas' && (
                        <CatalogoPlataformas
                            plataformas={plataformas}
                            abrirModalNuevaPlataforma={abrirModalNuevaPlataforma}
                            abrirModalEditarPlataforma={abrirModalEditarPlataforma}
                            eliminarPlataforma={eliminarPlataforma}
                        />
                    )}

                    {vistaActual === 'Usuarios' && (
                        <GestionUsuarios
                            usuarios={usuarios}
                            eliminarUsuario={eliminarUsuario}
                            abrirModalNuevoUsuario={abrirModalNuevoUsuario}
                            abrirModalEditarUsuario={abrirModalEditarUsuario}
                        />
                    )}
                </div>
            </main>

            
            {mostrarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-center text-[#43a047] border-b pb-3 uppercase tracking-wide">
                            {plataformaEnEdicion ? 'Editar Plataforma' : 'Registrar Plataforma'}
                        </h2>

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
                                <label className="text-xs font-bold text-gray-500 uppercase">Precio Base Mensual ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej. 149.00"
                                    value={precioBasePlataforma}
                                    onChange={(e) => asignarPrecioBasePlataforma(e.target.value)}
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
                                    {plataformaEnEdicion ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Usuario */}
            {mostrarModalUsuario && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-center text-[#43a047] border-b pb-3 uppercase tracking-wide">
                            {usuarioEnEdicion ? 'Editar Usuario' : 'Registrar Usuario'}
                        </h2>

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
                                <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                                <input
                                    type="text"
                                    placeholder="Ej. 951 123 4567"
                                    value={telefonoUsuario}
                                    onChange={(e) => asignarTelefonoUsuario(e.target.value)}
                                    className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    Contraseña {usuarioEnEdicion && <span className="text-gray-400 normal-case">(Dejar en blanco para no cambiar)</span>}
                                </label>
                                <input
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={passwordUsuario}
                                    onChange={(e) => asignarPasswordUsuario(e.target.value)}
                                    required={!usuarioEnEdicion}
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
                                    {usuarioEnEdicion ? 'Actualizar' : 'Guardar'}
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