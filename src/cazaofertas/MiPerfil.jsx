function MiPerfil({ usuario }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl">
            <h2 className="text-2xl font-bold text-[#43a047] mb-2">Ajustes de Cuenta</h2>
            <p className="text-gray-500 text-sm mb-6">Actualiza tu información de contacto personal.</p>

            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Correo Electrónico</label>
                    <input
                        type="email"
                        defaultValue={usuario.email}
                        readOnly
                        className="p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none cursor-not-allowed font-medium"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Número de teléfono</label>
                    <input
                        type="tel"
                        defaultValue={usuario.telefono || ''}
                        className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none font-medium"
                    />
                </div>
                <button
                    type="button"
                    className="mt-4 bg-black text-white p-3 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-md"
                >
                    Actualizar datos
                </button>
            </form>
        </div>
    );
}

export default MiPerfil;
