import { useState, useMemo, useEffect } from 'react';

function Promociones({ promociones }) {
    const listaPromociones = Array.isArray(promociones) ? promociones : [];

    const [tamanoPagina, asignarTamanoPagina] = useState(10);
    const [paginaActual, asignarPaginaActual] = useState(1);

    const totalPaginas = Math.max(1, Math.ceil(listaPromociones.length / tamanoPagina));

    useEffect(() => {
        if (paginaActual > totalPaginas) {
            asignarPaginaActual(totalPaginas);
        }
    }, [totalPaginas, paginaActual]);

    const promocionesPagina = useMemo(() => {
        const inicio = (paginaActual - 1) * tamanoPagina;
        return listaPromociones.slice(inicio, inicio + tamanoPagina);
    }, [listaPromociones, paginaActual, tamanoPagina]);

    const cambiarTamanoPagina = (evento) => {
        asignarTamanoPagina(Number(evento.target.value));
        asignarPaginaActual(1);
    };

    const irPaginaAnterior = () => asignarPaginaActual((p) => Math.max(1, p - 1));
    const irPaginaSiguiente = () => asignarPaginaActual((p) => Math.min(totalPaginas, p + 1));

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#43a047]">Ofertas disponibles</h2>

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
            </div>

            <div className="hidden sm:block overflow-x-auto">
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
                        {promocionesPagina.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">
                                {listaPromociones.length === 0 ? 'Buscando ofertas...' : 'No hay más ofertas en esta página.'}
                            </td></tr>
                        ) : (
                            promocionesPagina.map((promo) => (
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

            <div className="sm:hidden flex flex-col gap-3">
                {promocionesPagina.length === 0 ? (
                    <p className="text-center p-8 text-gray-500">
                        {listaPromociones.length === 0 ? 'Buscando ofertas...' : 'No hay más ofertas en esta página.'}
                    </p>
                ) : (
                    promocionesPagina.map((promo) => (
                        <div key={promo.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <p className="font-semibold text-gray-800">{promo.plataforma}</p>
                                    <p className="text-sm text-gray-600">{promo.suscripcion}</p>
                                </div>
                                <span className="font-bold text-[#4ade80] whitespace-nowrap">${promo.precio}</span>
                            </div>
                            <p className="text-xs text-gray-500">Válida hasta {promo.fin_promocion}</p>
                            <a href={promo.link} target="_blank" rel="noreferrer" className="bg-[#43a047] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#388e3c] transition-colors text-center">Aprovechar</a>
                        </div>
                    ))
                )}
            </div>

            {listaPromociones.length > 0 && (
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500">
                        Página <strong className="text-gray-700">{paginaActual}</strong> de {totalPaginas} · {listaPromociones.length} ofertas
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

export default Promociones;
