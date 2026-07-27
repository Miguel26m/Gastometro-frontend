import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicios/api';
import GestionOfertas from './GestionOfertas';
import MiPerfil from './MiPerfil';

function PanelCazaofertas() {
    const [vistaActual, asignarVistaActual] = useState('Promociones');
    const [promociones, asignarPromociones] = useState([]);
    const [usuario, asignarUsuario] = useState({ name: '', email: '', telefono: '' });

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

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#43a047] text-white flex flex-col justify-between shadow-xl z-10">
                <div>
                    <div className="p-6 flex flex-col items-center border-b border-white/20">
                        <div className="w-28 h-28 mb-3 overflow-hidden rounded-full flex items-center justify-center drop-shadow-md">
                            <img src="/logo.png" alt="Logo Gastómetro" className="w-full h-full object-cover scale-150" />
                        </div>                        <h1 className="text-lg font-bold tracking-wider text-center">GASTOMETRO</h1>
                        <span className="text-xs bg-white text-[#43a047] px-2 py-0.5 rounded mt-1 font-bold">OPERATIVO</span>
                    </div>
                    <nav className="flex flex-col mt-6 gap-2 px-4">
                        <button
                            onClick={() => asignarVistaActual('Promociones')}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Promociones' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Promociones' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Gestión de ofertas
                        </button>
                        <button
                            onClick={() => asignarVistaActual('Configuracion')}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg font-semibold transition-colors ${vistaActual === 'Configuracion' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <div className={`w-3 h-3 rounded-sm ${vistaActual === 'Configuracion' ? 'bg-white' : 'bg-white/70'}`}></div>
                            Mi perfil
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
                        <span className="font-bold text-[#4ade80] tracking-widest hidden md:block w-40">{vistaActual.toUpperCase()}</span>
                        <div className="flex w-full max-w-md">
                            <input type="text" placeholder="Buscar en el sistema..." className="flex-1 px-3 py-1.5 bg-white text-black rounded-l-sm outline-none text-sm" />                            <button className="bg-[#43a047] px-4 py-1.5 font-semibold text-sm rounded-r-sm hover:bg-[#388e3c] transition-colors">Buscar</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#4ade80]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        <span className="font-semibold text-[#4ade80] text-sm md:text-base hidden sm:block">Panel Cazaofertas</span>
                    </div>
                </header>

                <div className="p-8 md:p-12 overflow-y-auto flex-1">

                    {vistaActual === 'Promociones' && (
                        <GestionOfertas promociones={promociones} />
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
