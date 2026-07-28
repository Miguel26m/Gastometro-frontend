function Suscripciones({ misSuscripciones, totalGasto, asignarMostrarModal, eliminarSuscripcion }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#43a047]">Mis suscripciones</h2>
                    <p className="text-gray-500 text-sm mt-1">Gasto total: <span className="font-bold text-black">${totalGasto.toFixed(2)}</span></p>
                </div>
                <button onClick={() => asignarMostrarModal(true)} className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-md">
                    + Agregar suscripción
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-[#3EA341] text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg">Plataforma</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Costo</th>
                            <th className="p-4">Día de cobro</th>
                            <th className="p-4 text-center rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {misSuscripciones.map((sub) => (
                            <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {sub.logo_url ? (
                                            <img src={sub.logo_url} alt={sub.nombre} className="w-9 h-9 object-cover rounded-lg border border-gray-200" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                                                {sub.nombre.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="font-semibold text-gray-800">{sub.nombre}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-900">{sub.categoria || 'General'}</td>
                                <td className="p-4 font-medium text-gray-800">${sub.pivot.costo_personalizado}</td>
                                <td className="p-4 text-gray-900">Día {sub.pivot.dia_corte}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => eliminarSuscripcion(sub.id)} className="bg-[#3EA341] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-500 transition-colors">Cancelar</button>
                                </td>
                            </tr>
                        ))}
                        {misSuscripciones.length === 0 && (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">No tienes suscripciones registradas.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Suscripciones;