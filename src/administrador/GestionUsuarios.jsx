function GestionUsuarios({ usuarios, eliminarUsuario, asignarMostrarModalUsuario }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#43a047]">Control de usuarios</h2>
                    <p className="text-gray-500 text-sm mt-1">Administra las cuentas registradas en el sistema.</p>
                </div>
                <button onClick={() => asignarMostrarModalUsuario(true)} className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2">
                    <span className="text-xl leading-none">+</span> Nuevo usuario
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg w-16">ID</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Correo</th>
                            <th className="p-4">Rol ID</th>
                            <th className="p-4 text-center rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500 bg-gray-50 italic">Esperando conexión con la ruta de usuarios o no hay registros...</td></tr>
                        ) : (
                            usuarios.map((usr) => (
                                <tr key={usr.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-400">#{usr.id}</td>
                                    <td className="p-4 font-semibold text-gray-800">{usr.name}</td>
                                    <td className="p-4 text-gray-600">{usr.email}</td>
                                    <td className="p-4 text-gray-600 font-mono bg-gray-50 rounded text-center w-20">{usr.rol_id}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => eliminarUsuario(usr.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm">
                                            Banear / Eliminar
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

export default GestionUsuarios;
