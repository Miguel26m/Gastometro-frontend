import { useState, useMemo, useEffect } from 'react';

function GestionUsuarios({ usuarios, eliminarUsuario, abrirModalNuevoUsuario, abrirModalEditarUsuario }) {
    const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];

   
    const [filtroRol, asignarFiltroRol] = useState('Todos');
    const [tamanoPagina, asignarTamanoPagina] = useState(10);
    const [paginaActual, asignarPaginaActual] = useState(1);

   
    const usuariosFiltrados = useMemo(() => {
        if (filtroRol === 'Todos') return listaUsuarios;
        return listaUsuarios.filter((usr) => {
            const nombreRol = usr.rol ? usr.rol.nombre.toLowerCase() : '';
            return nombreRol === filtroRol.toLowerCase();
        });
    }, [listaUsuarios, filtroRol]);

    const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / tamanoPagina));

    useEffect(() => {
        if (paginaActual > totalPaginas) {
            asignarPaginaActual(totalPaginas);
        }
    }, [totalPaginas, paginaActual]);

    
    const usuariosPagina = useMemo(() => {
        const inicio = (paginaActual - 1) * tamanoPagina;
        return usuariosFiltrados.slice(inicio, inicio + tamanoPagina);
    }, [usuariosFiltrados, paginaActual, tamanoPagina]);

    const cambiarTamanoPagina = (evento) => {
        asignarTamanoPagina(Number(evento.target.value));
        asignarPaginaActual(1);
    };

    const manejarCambioFiltro = (evento) => {
        asignarFiltroRol(evento.target.value);
        asignarPaginaActual(1);
    };

    const irPaginaAnterior = () => asignarPaginaActual((p) => Math.max(1, p - 1));
    const irPaginaSiguiente = () => asignarPaginaActual((p) => Math.min(totalPaginas, p + 1));

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#3EA341]">Control de usuarios</h2>
                    <p className="text-gray-500 text-sm mt-1">Administra las cuentas registradas en el sistema.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    {/* Filtro por Rol */}
                    <div className="flex items-center gap-2 text-sm">
                        <label className="font-semibold text-gray-500 whitespace-nowrap">Filtrar:</label>
                        <select
                            value={filtroRol}
                            onChange={manejarCambioFiltro}
                            className="font-semibold bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-[#4ade80]"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Cliente">Cliente</option>
                            <option value="Cazaofertas">Cazaofertas</option>
                        </select>
                    </div>

                  
                    <div className="flex items-center gap-2 text-sm">
                        <label className="font-semibold text-gray-500 whitespace-nowrap">Mostrar:</label>
                        <select
                            value={tamanoPagina}
                            onChange={cambiarTamanoPagina}
                            className="font-semibold bg-[#EAF7EA] text-[#2f7a32] border border-[#bfe6bf] rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-[#4ade80]"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <button onClick={abrirModalNuevoUsuario} className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xl leading-none">+</span> Nuevo usuario
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-[#3EA341] text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg w-16">ID</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Correo</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4 text-center rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosPagina.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-8 text-gray-500 bg-gray-50 italic">
                                {listaUsuarios.length === 0 ? 'Esperando conexión con la ruta de usuarios o no hay registros...' : 'No se encontraron usuarios para este rol.'}
                            </td></tr>
                        ) : (
                            usuariosPagina.map((usr) => (
                                <tr key={usr.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-400">#{usr.id}</td>
                                    <td className="p-4 font-semibold text-gray-800">{usr.name}</td>
                                    <td className="p-4 text-gray-800">{usr.email}</td>
                                    <td className="p-4 text-gray-800">{usr.telefono || 'Sin registro'}</td>
                                    <td className="p-4 text-gray-800 font-medium">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            usr.rol?.nombre === 'Administrador' ? 'bg-red-100 text-red-700' :
                                            usr.rol?.nombre === 'Cazaofertas' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {usr.rol ? usr.rol.nombre : 'Sin rol'}
                                        </span>
                                    </td>                                    
                                    <td className="p-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => abrirModalEditarUsuario(usr)}
                                            className="bg-[#3EA341] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                                        >
                                            Editar
                                        </button>

                                        {usr.rol_id != 1 && (
                                            <button
                                                onClick={() => eliminarUsuario(usr.id)}
                                                className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Controles de paginación */}
            {usuariosFiltrados.length > 0 && (
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500">
                        Página <strong className="text-gray-700">{paginaActual}</strong> de {totalPaginas} · {usuariosFiltrados.length} usuarios encontrados
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={irPaginaAnterior}
                            disabled={paginaActual === 1}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#EAF7EA] text-[#2f7a32] border border-[#bfe6bf] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#dcf1dc] transition-colors"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={irPaginaSiguiente}
                            disabled={paginaActual === totalPaginas}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#EAF7EA] text-[#2f7a32] border border-[#bfe6bf] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#dcf1dc] transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GestionUsuarios;