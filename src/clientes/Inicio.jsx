function Inicio({ usuario, misSuscripciones, tieneSuscripciones, totalGasto, asignarMostrarModal }) {
    return (
        <div>
            <h2 className="text-3xl font-bold text-[#43a047] mb-8 uppercase tracking-wide">
                BIENVENIDO {usuario.name}
            </h2>
            {tieneSuscripciones && (
                <h3 className="text-xl font-bold text-black mb-4">
                    Gastos mensuales: ${totalGasto.toFixed(2)}
                </h3>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {!tieneSuscripciones ? (
                        <button onClick={() => asignarMostrarModal(true)} className="w-full bg-[#4ade80] hover:bg-[#3ee075] text-white rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.01] hover:shadow-lg aspect-video shadow-md border-4 border-transparent hover:border-white/50">
                            <span className="text-8xl font-light leading-none">+</span>
                            <span className="text-2xl font-bold">Agregar suscripción</span>
                        </button>
                    ) : (
                        <div className="w-full bg-[#4ade80] rounded-3xl p-8 flex items-end justify-center gap-6 aspect-video shadow-md relative">
                            <div className="w-1/5 bg-white rounded-t-sm h-[40%] hover:opacity-90 transition-opacity cursor-pointer"></div>
                            <div className="w-1/5 bg-white rounded-t-sm h-[80%] hover:opacity-90 transition-opacity cursor-pointer"></div>
                            <div className="w-1/5 bg-white rounded-t-sm h-[50%] hover:opacity-90 transition-opacity cursor-pointer"></div>
                            <div className="absolute bottom-8 w-[80%] h-0.5 bg-white/50"></div>
                        </div>
                    )}
                </div>
                <div className="bg-[#d1d5db] rounded-3xl p-6 flex flex-col gap-4 shadow-inner min-h-[300px]">
                    <h4 className="text-white text-center font-bold text-xl bg-[#4ade80] py-2 px-4 rounded-xl shadow-sm">Alertas</h4>
                    {!tieneSuscripciones ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-[#4ade80] text-white font-bold text-center p-4 rounded-xl shadow-sm w-full">No hay alertas ahora</div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[250px] pr-2">
                            {misSuscripciones.map(sub => (
                                <div key={sub.id} className="bg-[#4ade80] text-white font-bold p-3 rounded-xl shadow-sm text-sm">
                                    Pago día {sub.pivot.dia_corte}: {sub.nombre}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Inicio;
