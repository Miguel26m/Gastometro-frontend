function Configuracion({ usuario }) {
    return (
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#43a047] mb-6">Ajustes de cuenta</h2>
            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Nombre de usuario</label>
                    <input type="text" defaultValue={usuario.name} readOnly className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Correo electrónico</label>
                    <input type="email" defaultValue={usuario.email} readOnly className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Número de teléfono</label>
                    <input type="tel" defaultValue={usuario.telefono || ''} className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Límite de presupuesto mensual</label>
                    <input type="number" step="0.01" defaultValue={usuario.presupuesto || ''} placeholder="Ej. 1500.00" className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all" />
                </div>
                <button type="button" className="mt-2 bg-black text-white p-3 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-md">
                    Actualizar datos
                </button>
            </form>
        </div>
    );
}

export default Configuracion;
