function Promociones({ promociones }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-[#43a047] mb-6">Ofertas disponibles</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-[#3EA341] text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg">Plataforma</th>
                            <th className="p-4">Oferta</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Válida hasta</th>
                            <th className="p-4 text-center rounded-tr-lg">Enlace</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promociones.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">Buscando ofertas...</td></tr>
                        ) : (
                            promociones.map((promo) => (
                                <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-semibold text-gray-800">{promo.plataforma}</td>
                                    <td className="p-4 text-gray-600">{promo.suscripcion}</td>
                                    <td className="p-4 font-bold text-[#4ade80]">${promo.precio}</td>
                                    <td className="p-4 text-gray-600">{promo.fin_promocion}</td>
                                    <td className="p-4 text-center">
                                        <a href={promo.link} target="_blank" rel="noreferrer" className="bg-[#43a047] text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-[#388e3c] transition-colors inline-block">Aprovechar</a>
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

export default Promociones;
