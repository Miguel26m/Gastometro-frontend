function MiPerfil({ miPerfil }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl">
            <h2 className="text-2xl font-bold text-[#43a047] mb-6">Seguridad de Administrador</h2>
            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Correo Electrónico (Solo Lectura)</label>
                    <input type="email" defaultValue={miPerfil.email} readOnly className="p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none cursor-not-allowed font-medium" />
                </div>
                <button type="button" className="mt-4 bg-black text-white p-3 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-md">
                    Actualizar contraseña
                </button>
            </form>
        </div>
    );
}

export default MiPerfil;
