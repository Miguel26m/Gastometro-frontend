import { useState, useMemo, useEffect } from 'react';

function Suscripciones({ misSuscripciones, totalGasto, asignarMostrarModal, eliminarSuscripcion }) {
    const listaSuscripciones = Array.isArray(misSuscripciones) ? misSuscripciones : [];

    const [tamanoPagina, asignarTamanoPagina] = useState(10);
    const [paginaActual, asignarPaginaActual] = useState(1);

    const totalPaginas = Math.max(1, Math.ceil(listaSuscripciones.length / tamanoPagina));

    // Si la lista cambia (o se reduce el tamaño de página) y la página actual ya no existe, regresa a la última válida
    useEffect(() => {
        if (paginaActual > totalPaginas) {
            asignarPaginaActual(totalPaginas);
        }
    }, [totalPaginas, paginaActual]);

    const suscripcionesPagina = useMemo(() => {
        const inicio = (paginaActual - 1) * tamanoPagina;
        return listaSuscripciones.slice(inicio, inicio + tamanoPagina);
    }, [listaSuscripciones, paginaActual, tamanoPagina]);

    const cambiarTamanoPagina = (evento) => {
        asignarTamanoPagina(Number(evento.target.value));
        asignarPaginaActual(1);
    };

    const irPaginaAnterior = () => asignarPaginaActual((p) => Math.max(1, p - 1));
    const irPaginaSiguiente = () => asignarPaginaActual((p) => Math.min(totalPaginas, p + 1));

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#43a047]">Mis suscripciones</h2>
                    <p className="text-gray-500 text-sm mt-1">Gasto total: <span className="font-bold text-black">${totalGasto.toFixed(2)}</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <label className="font-semibold text-gray-500 whitespace-nowrap">Mostrar</label>
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
                    <button onClick={() => asignarMostrarModal(true)} className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors shadow-md whitespace-nowrap">
                        + Agregar
                    </button>
                </div>
            </div>

            {/* Tabla: visible desde tablet en adelante */}
            <div className="hidden sm:block overflow-x-auto">
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
                        {suscripcionesPagina.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">
                                {listaSuscripciones.length === 0 ? 'No tienes suscripciones registradas.' : 'No hay más suscripciones en esta página.'}
                            </td></tr>
                        ) : (
                            suscripcionesPagina.map((sub) => (
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
                                        <button onClick={() => eliminarSuscripcion(sub.id, sub.nombre)} className="bg-[#3EA341] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-500 transition-colors">Cancelar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tarjetas: solo en móvil */}
            <div className="sm:hidden flex flex-col gap-3">
                {suscripcionesPagina.length === 0 ? (
                    <p className="text-center p-8 text-gray-500">
                        {listaSuscripciones.length === 0 ? 'No tienes suscripciones registradas.' : 'No hay más suscripciones en esta página.'}
                    </p>
                ) : (
                    suscripcionesPagina.map((sub) => (
                        <div key={sub.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                {sub.logo_url ? (
                                    <img src={sub.logo_url} alt={sub.nombre} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                                        {sub.nombre.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-800">{sub.nombre}</p>
                                    <p className="text-xs text-gray-500">{sub.categoria || 'General'}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">Costo: <strong className="text-gray-900">${sub.pivot.costo_personalizado}</strong></span>
                                <span className="text-gray-700">Día {sub.pivot.dia_corte}</span>
                            </div>
                            <button onClick={() => eliminarSuscripcion(sub.id, sub.nombre)} className="bg-[#3EA341] text-white py-2 rounded-md text-sm font-semibold hover:bg-green-500 transition-colors">Cancelar</button>
                        </div>
                    ))
                )}
            </div>

            {/* Controles de paginación */}
            {listaSuscripciones.length > 0 && (
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500">
                        Página <strong className="text-gray-700">{paginaActual}</strong> de {totalPaginas} · {listaSuscripciones.length} suscripciones
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

export default Suscripciones;