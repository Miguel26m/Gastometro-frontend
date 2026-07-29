import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicios/api';
import GestionOfertas from './GestionOfertas';
import MiPerfil from './MiPerfil';

function PanelCazaofertas() {
    const [vistaActual, asignarVistaActual] = useState('Promociones');
    const [usuario, asignarUsuario] = useState({ name: '', email: '', telefono: '' });
    
    // Control del menú lateral en móvil
    const [menuMovilAbierto, asignarMenuMovilAbierto] = useState(false);
    
    const navegar = useNavigate();

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const respuesta = await api.get('/user');
            asignarUsuario(respuesta.data);
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
            
            {/* Fondo oscuro para móvil */}
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
                        <span className="text-xs bg-white text-[#43a047] px-2 py-0.5 rounded mt-1 font-bold">CAZAOFERTAS</span>
                    </div>
                    
                    <nav className="flex flex-col mt-6 gap-2 px-4">
                        <button
                            onClick={() => cambiarVista('Promociones')}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Promociones' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${vistaActual === 'Promociones' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Gestión de ofertas
                        </button>
                        <button
                            onClick={() => cambiarVista('Configuracion')}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Configuracion' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${vistaActual === 'Configuracion' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Mi perfil
                        </button>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-black text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-10">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <button
                            onClick={() => asignarMenuMovilAbierto(true)}
                            className="md:hidden text-white p-1 -ml-1"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="font-bold text-[#4ade80] tracking-widest hidden md:block w-40">{vistaActual.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-6">
                        <button 
                            onClick={() => navegar('/')} 
                            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors hidden sm:block"
                        >
                            Ir al inicio
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            <span className="font-semibold text-[#4ade80] text-sm truncate max-w-[10rem]">{usuario.name || 'Cargando...'}</span>
                        </div>
                        <button 
                            onClick={cerrarSesion} 
                            className="bg-red-600 text-white w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            title="Cerrar sesión"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-6 md:p-12 overflow-y-auto flex-1 min-h-0">
                    {vistaActual === 'Promociones' && (
                        <GestionOfertas />
                    )}

                    {vistaActual === 'Configuracion' && (
                        <MiPerfil usuario={usuario} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default PanelCazaofertas;