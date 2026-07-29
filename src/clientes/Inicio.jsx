import { useState, useMemo } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Paleta de verdes para las gráficas (coherente con el tema de la app)
const COLORES = ['#3EA341', '#4ade80', '#86efac', '#16a34a', '#065f46', '#22c55e', '#a7f3d0'];

// Campo real confirmado en el objeto de suscripción: sub.pivot.costo_personalizado
const obtenerCostoMensual = (sub) => {
    return parseFloat(sub.pivot.costo_personalizado) || 0;
};

function Inicio({ usuario, misSuscripciones, tieneSuscripciones, totalGasto, asignarMostrarModal }) {
    const [periodo, asignarPeriodo] = useState('mensual'); // 'mensual' | 'anual'
    const [tipoGrafica, asignarTipoGrafica] = useState('barra'); // 'barra' | 'pastel'

    const datosGrafica = useMemo(() => {
        if (!tieneSuscripciones) return [];

        return misSuscripciones.map((sub) => {
            const costoMensual = obtenerCostoMensual(sub);
            const valor = periodo === 'anual' ? costoMensual * 12 : costoMensual;
            return {
                nombre: sub.nombre,
                valor: Number(valor.toFixed(2))
            };
        });
    }, [misSuscripciones, periodo, tieneSuscripciones]);

    const totalMostrado = useMemo(() => {
        return datosGrafica.reduce((acc, item) => acc + item.valor, 0);
    }, [datosGrafica]);

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#43a047] mb-6 sm:mb-8 uppercase tracking-wide">
                BIENVENIDO {usuario.name}
            </h2>

            {tieneSuscripciones && (
                <h3 className="text-lg sm:text-xl font-bold text-black mb-4">
                    Gastos mensuales: ${totalGasto.toFixed(2)}
                </h3>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                <div className="lg:col-span-2">
                    {!tieneSuscripciones ? (
                        <button
                            onClick={() => asignarMostrarModal(true)}
                            className="w-full bg-[#4ade80] hover:bg-[#3ee075] text-white rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-[1.01] hover:shadow-lg aspect-video shadow-md border-4 border-transparent hover:border-white/50"
                        >
                            <span className="text-6xl sm:text-8xl font-light leading-none">+</span>
                            <span className="text-xl sm:text-2xl font-bold text-center">Agregar suscripción</span>
                        </button>
                    ) : (
                        <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-[#e2f3e2]">

                            {/* Controles: tipo de gráfica y periodo */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Gastos {periodo === 'anual' ? 'anuales (estimado)' : 'del mes'}
                                    </p>
                                    <p className="text-2xl font-bold text-[#3EA341]">
                                        ${totalMostrado.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <select
                                        value={periodo}
                                        onChange={(e) => asignarPeriodo(e.target.value)}
                                        className="flex-1 sm:flex-none text-sm font-semibold bg-[#EAF7EA] text-[#2f7a32] border border-[#bfe6bf] rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-[#4ade80]"
                                    >
                                        <option value="mensual">Mensual</option>
                                        <option value="anual">Anual</option>
                                    </select>

                                    <select
                                        value={tipoGrafica}
                                        onChange={(e) => asignarTipoGrafica(e.target.value)}
                                        className="flex-1 sm:flex-none text-sm font-semibold bg-[#EAF7EA] text-[#2f7a32] border border-[#bfe6bf] rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-[#4ade80]"
                                    >
                                        <option value="barra">Gráfica de barra</option>
                                        <option value="pastel">Gráfica de pastel</option>
                                    </select>
                                </div>
                            </div>

                            {periodo === 'anual' && (
                                <p className="text-xs text-gray-400 mb-3 -mt-1">
                                    * Estimado según tus suscripciones activas actuales × 12 meses.
                                </p>
                            )}

                            {/* Gráfica */}
                            <div className="w-full h-[220px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    {tipoGrafica === 'barra' ? (
                                        <BarChart data={datosGrafica} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: '#555' }} interval={0} angle={-20} textAnchor="end" height={50} />
                                            <YAxis tick={{ fontSize: 12, fill: '#555' }} />
                                            <Tooltip
                                                formatter={(value) => [`$${value}`, 'Gasto']}
                                                contentStyle={{ borderRadius: 8, border: '1px solid #bfe6bf' }}
                                            />
                                            <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                                                {datosGrafica.map((_, index) => (
                                                    <Cell key={index} fill={COLORES[index % COLORES.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    ) : (
                                        <PieChart>
                                            <Pie
                                                data={datosGrafica}
                                                dataKey="valor"
                                                nameKey="nombre"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={(entrada) => `${entrada.nombre}`}
                                            >
                                                {datosGrafica.map((_, index) => (
                                                    <Cell key={index} fill={COLORES[index % COLORES.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`$${value}`, 'Gasto']} />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                        </PieChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel de Alertas rediseñado */}
                <div className="bg-[#EAF7EA] rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-md border border-[#bfe6bf] min-h-[220px] sm:min-h-[300px]">
                    <h4 className="text-white text-center font-bold text-lg sm:text-xl bg-[#3EA341] py-2 px-4 rounded-xl shadow-sm">
                        Alertas
                    </h4>

                    {!tieneSuscripciones ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-white text-[#2f7a32] font-semibold text-center p-4 rounded-xl shadow-sm w-full border border-[#bfe6bf]">
                                No hay alertas ahora
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[250px] pr-2">
                            {misSuscripciones.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="bg-white text-gray-800 font-semibold p-3 rounded-xl shadow-sm text-sm border-l-4 border-[#3EA341] flex items-center gap-2"
                                >
                                    <span className="text-lg"></span>
                                    <span>
                                        Pago día <strong className="text-[#3EA341]">{sub.pivot.dia_corte}</strong>: {sub.nombre}
                                    </span>
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
