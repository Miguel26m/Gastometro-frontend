function GestionOfertas({ promociones }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#43a047]">Panel de promociones activas</h2>
                    <p className="text-gray-500 text-sm mt-1">Monitorea y administra las ofertas actuales del sistema.</p>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors cursor-not-allowed">
                    Obtener nuevas ofertas (API en mantenimiento)
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg">Plataforma</th>
                            <th className="p-4">Oferta</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Válido hasta</th>
                            <th className="p-4 text-center rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promociones.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-8 text-gray-500 bg-gray-50 italic">
                                    Esperando conexión con la API externa...
                                </td>
                            </tr>
                        ) : (
                            promociones.map((promo) => (
                                <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-semibold text-gray-800">{promo.plataforma}</td>
                                    <td className="p-4 text-gray-600">{promo.suscripcion}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-green-50 text-[#43a047] px-3 py-1 rounded-full text-sm font-medium">
                                            {promo.categoria}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">${promo.precio}</td>
                                    <td className="p-4 text-gray-500 text-sm">{promo.fin_promocion}</td>
                                    <td className="p-4 text-center flex justify-center gap-2">
                                        <button className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-200 transition-colors">
                                            Editar
                                        </button>
                                        <button className="bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-200 transition-colors">
                                            Quitar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestionOfertas;
