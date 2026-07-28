import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InicioPublico() {
    const [mostrarModal, asignarMostrarModal] = useState(false);
    const [promociones, asignarPromociones] = useState([]);
    const navegar = useNavigate();

    useEffect(() => {
        const obtenerPromociones = async () => {
            try {
                const respuesta = await fetch('https://api.npoint.io/fd38d569dba9550006bd');
                const datos = await respuesta.json();
                asignarPromociones(datos);
            } catch (error) {
                console.error(error);
            }
        };
        obtenerPromociones();
    }, []);

    const intentarAccionProtegida = () => {
        asignarMostrarModal(true);
    };

    return (
        <div className="min-h-screen bg-[#F3F8F2] flex flex-col relative">
            <nav className="bg-[#3EA341] p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo Gastómetro" className="h-16 object-contain bg-white rounded-full p-1" />
                    <h1 className="text-white font-bold text-2xl tracking-wide">GASTÓMETRO</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navegar('/login')} 
                        className="bg-transparent border-none text-white font-bold text-lg cursor-pointer hover:underline"
                    >
                        Entrar
                    </button>
                    <button 
                        onClick={() => navegar('/registro')} 
                        className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-base hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                    >
                        Registrarse
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-6xl mx-auto w-full flex-grow flex flex-col items-center mt-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-black text-center mb-6">
                    Toma el control de tus suscripciones
                </h2>
                
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-3xl text-center mb-10">
                    <p className="text-lg text-gray-700 font-medium mb-4">
                        Gastómetro es la herramienta definitiva para gestionar todos tus gastos recurrentes en plataformas de streaming, software y servicios.
                    </p>
                    <p className="text-lg text-gray-700 font-medium">
                        Descubre ofertas exclusivas, unifica tus fechas de pago y evita cobros sorpresa mes a mes.
                    </p>
                </div>

                <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-6">
                    <h3 className="text-2xl font-bold text-[#3EA341] mb-4">Promociones Destacadas</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {promociones.length > 0 ? (
                            promociones.map((promo) => (
                                <div key={promo.id} className="bg-[#E8F0E8] p-5 rounded-xl border border-[#3EA341]/30 flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-xl text-black">{promo.plataforma}</h4>
                                        <span className="text-xs bg-white text-[#3EA341] font-bold px-2 py-1 rounded-md border border-[#3EA341]/50 text-right">
                                            {promo.categoria}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 font-medium">{promo.suscripcion}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[#3EA341] font-extrabold text-2xl">${promo.precio} MXN</span>
                                        <span className="text-xs text-gray-500 font-bold">Vigencia: {promo.fin_promocion}</span>
                                    </div>
                                    <button 
                                        onClick={intentarAccionProtegida}
                                        className="mt-3 bg-black text-white py-2.5 rounded-lg font-bold hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
                                    >
                                        Guardar oferta
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full text-center font-medium">
                                Cargando promociones...
                            </p>
                        )}
                    </div>
                </div>
            </main>

            {mostrarModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#3EA341] p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 text-center transform transition-all">
                        <h2 className="text-white text-3xl font-bold">¡No te lo pierdas!</h2>
                        <p className="text-white/90 font-medium text-lg">
                            Para guardar esta oferta y llevar el control de tus gastos necesitas una cuenta. ¡Es gratis!
                        </p>
                        <div className="flex flex-col gap-3 mt-2">
                            <button 
                                onClick={() => navegar('/registro')}
                                className="bg-black text-white p-3.5 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                            >
                                Crear mi cuenta
                            </button>
                            <button 
                                onClick={() => navegar('/login')}
                                className="bg-transparent border-2 border-white text-white p-3.5 rounded-xl font-bold text-lg hover:bg-white hover:text-[#3EA341] transition-all cursor-pointer"
                            >
                                Ya tengo cuenta
                            </button>
                        </div>
                        <button 
                            onClick={() => asignarMostrarModal(false)}
                            className="text-white/70 font-bold hover:text-white underline mt-2 cursor-pointer"
                        >
                            Seguir explorando
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InicioPublico;