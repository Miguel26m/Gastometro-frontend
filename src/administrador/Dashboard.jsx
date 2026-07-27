function Dashboard({ plataformas, usuarios }) {
    return (
        <div>
            <h2 className="text-3xl font-bold text-[#43a047] mb-2 uppercase tracking-wide">
                Resumen del Sistema
            </h2>
            <p className="text-gray-500 mb-8 font-medium">Bienvenido al panel de control principal de Gastómetro.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-6xl font-black text-[#4ade80] drop-shadow-sm">{plataformas.length}</span>
                    <span className="text-lg font-bold text-gray-600 mt-2 uppercase tracking-wide">Plataformas activas</span>
                </div>
                <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <span className="text-6xl font-black text-black drop-shadow-sm">{usuarios.length}</span>
                    <span className="text-lg font-bold text-gray-600 mt-2 uppercase tracking-wide">Usuarios registrados</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
