function CatalogoPlataformas({ plataformas, asignarMostrarModal, eliminarPlataforma }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#43a047]">Catálogo Maestro de Plataformas</h2>
                    <p className="text-gray-500 text-sm mt-1">Gestiona los servicios disponibles para los usuarios.</p>
                </div>
                <button onClick={() => asignarMostrarModal(true)} className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2">
                    <span className="text-xl leading-none">+</span> Nueva Plataforma
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg w-16">ID</th>
                            <th className="p-4">Plataforma</th>
                            <th className="p-4">Categoría por Defecto</th>
                            <th className="p-4 text-center rounded-tr-lg w-32">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plataformas.length === 0 ? (
                            <tr><td colSpan="4" className="text-center p-8 text-gray-500">No hay plataformas registradas.</td></tr>
                        ) : (
                            plataformas.map((plat) => (
                                <tr key={plat.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-400">#{plat.id}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-center gap-1 w-20">
                                            {plat.logo_url ? (
                                                <img src={plat.logo_url} alt={plat.nombre} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                                                    {plat.nombre.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-semibold text-gray-800 text-sm text-center">{plat.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-green-50 text-[#43a047] px-3 py-1 rounded-full text-sm font-medium">
                                            {plat.categoria || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => eliminarPlataforma(plat.id)} className="bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-200 transition-colors">
                                            Eliminar
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

export default CatalogoPlataformas; 