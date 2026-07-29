import { useState, useEffect } from 'react';

function GestionOfertas() {
    const [promociones, asignarPromociones] = useState([]);
    const [cargandoLista, setCargandoLista] = useState(true);

    const [paginaActual, asignarPaginaActual] = useState(1);
    const itemsPorPagina = 5;

    const [oferta, asignarOferta] = useState({
        plataforma: '', categoria: '', suscripcion: '', precio: '', fin_promocion: '', link: ''
    });

    const [estado, asignarEstado] = useState({ cargando: false, mensaje: '', error: false });
    const urlNpoint = 'https://api.npoint.io/fd38d569dba9550006bd';

    useEffect(() => {
        obtenerPromociones();
    }, []);

    const obtenerPromociones = async () => {
        try {
            const respuesta = await fetch(urlNpoint);
            const datos = await respuesta.json();
            const ofertasArray = Array.isArray(datos) ? datos : [];
            asignarPromociones(ofertasArray.reverse());
            setCargandoLista(false);
        } catch (error) {
            console.error("Error al cargar la API:", error);
            setCargandoLista(false);
        }
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        asignarOferta(prev => ({ ...prev, [name]: value }));
    };

    const agregarOfertaAPI = async (evento) => {
        evento.preventDefault();
        asignarEstado({ cargando: true, mensaje: 'Conectando con el radar...', error: false });

        try {
            const respuestaGet = await fetch(urlNpoint);
            let datosActuales = await respuestaGet.json();
            if (!Array.isArray(datosActuales)) datosActuales = [];

            const nuevoId = datosActuales.length > 0 ? Math.max(...datosActuales.map(d => d.id)) + 1 : 1;
            const nuevaOferta = {
                id: nuevoId, link: oferta.link, precio: Number(oferta.precio), categoria: oferta.categoria,
                plataforma: oferta.plataforma, suscripcion: oferta.suscripcion, fin_promocion: oferta.fin_promocion
            };

            const nuevaLista = [...datosActuales, nuevaOferta];

            const respuestaPost = await fetch(urlNpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaLista)
            });

            if (respuestaPost.ok) {
                asignarEstado({ cargando: false, mensaje: '¡Oferta agregada exitosamente a la API!', error: false });
                asignarOferta({ plataforma: '', categoria: '', suscripcion: '', precio: '', fin_promocion: '', link: '' });
                asignarPromociones(nuevaLista.reverse());
                asignarPaginaActual(1);
            } else {
                throw new Error('Error al guardar en Npoint');
            }
        } catch (error) {
            asignarEstado({ cargando: false, mensaje: 'Error: No se pudo actualizar la API.', error: true });
        }
    };

   
    const eliminarOferta = async (idAEliminar) => {
        const confirmar = window.confirm('¿Estás seguro de eliminar esta oferta del radar?');
        if (!confirmar) return;

        try {
          
            const respuestaGet = await fetch(urlNpoint);
            let datosActuales = await respuestaGet.json();
            if (!Array.isArray(datosActuales)) datosActuales = [];

         
            const listaFiltrada = datosActuales.filter(item => item.id !== idAEliminar);

         
            const respuestaPost = await fetch(urlNpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listaFiltrada)
            });

            if (respuestaPost.ok) {
             
                asignarPromociones(listaFiltrada.reverse());
            } else {
                throw new Error('Error al eliminar en la API');
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar la oferta de la API.");
        }
    };

    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const ofertasPaginadas = promociones.slice(indicePrimerItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(promociones.length / itemsPorPagina);

    const cambiarPagina = (numeroPagina) => asignarPaginaActual(numeroPagina);

    const claseLabel = "text-black font-semibold text-base mb-1 block";
    const claseInput = "p-3 border border-gray-300 rounded-xl bg-gray-50 text-black font-medium outline-none focus:ring-2 focus:ring-[#43a047] focus:bg-white w-full shadow-sm transition-all";

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10">
            
          
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border-t-4 border-[#43a047]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Agregar Nueva Oferta</h2>
                <p className="text-gray-500 mb-8">Completa los datos para subir una nueva promoción.</p>

                {estado.mensaje && (
                    <p className={`mb-6 text-center p-3 rounded-lg font-bold text-sm ${estado.error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {estado.mensaje}
                    </p>
                )}

                <form onSubmit={agregarOfertaAPI} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={claseLabel}>Plataforma</label>
                        <input type="text" name="plataforma" value={oferta.plataforma} onChange={manejarCambio} required placeholder="Ej. Netflix" className={claseInput} />
                    </div>
                    <div>
                        <label className={claseLabel}>Categoría</label>
                        <input type="text" name="categoria" value={oferta.categoria} onChange={manejarCambio} required placeholder="Ej. Streaming" className={claseInput} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={claseLabel}>Suscripción (Plan)</label>
                        <input type="text" name="suscripcion" value={oferta.suscripcion} onChange={manejarCambio} required placeholder="Ej. Anual" className={claseInput} />
                    </div>
                    <div>
                        <label className={claseLabel}>Precio (MXN)</label>
                        <input type="number" name="precio" value={oferta.precio} onChange={manejarCambio} required min="0" placeholder="Ej. 149" className={claseInput} />
                    </div>
                    <div>
                        <label className={claseLabel}>Fin de Promoción</label>
                        <input type="text" name="fin_promocion" value={oferta.fin_promocion} onChange={manejarCambio} required placeholder="Permanente" className={claseInput} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={claseLabel}>Enlace</label>
                        <input type="url" name="link" value={oferta.link} onChange={manejarCambio} required placeholder="https://..." className={claseInput} />
                    </div>
                    <button type="submit" disabled={estado.cargando} className="md:col-span-2 bg-[#43a047] text-white p-3.5 rounded-xl font-bold text-lg hover:bg-[#388e3c] transition-all mt-4 cursor-pointer shadow-md disabled:opacity-50">
                        {estado.cargando ? 'Guardando...' : 'Agregar Oferta'}
                    </button>
                </form>
            </div>

        
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-[#43a047]">Ofertas activas ({promociones.length})</h2>
                </div>

                {cargandoLista ? (
                    <p className="text-center text-gray-500 font-bold py-4">Conectando con la API...</p>
                ) : promociones.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No hay ofertas registradas.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-100 text-[#43a047] text-sm uppercase tracking-wider">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Plataforma</th>
                                        <th className="p-4">Plan</th>
                                        <th className="p-4">Precio</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ofertasPaginadas.map((promo) => (
                                        <tr key={promo.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-400">#{promo.id}</td>
                                            <td className="p-4 font-semibold text-gray-800">{promo.plataforma}</td>
                                            <td className="p-4 text-gray-600">{promo.suscripcion}</td>
                                            <td className="p-4 text-[#43a047] font-bold">${promo.precio}</td>
                                            <td className="p-4 text-xs font-semibold text-gray-500">{promo.fin_promocion}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => eliminarOferta(promo.id)}
                                                    className="bg-red-600 hover:bg-red-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPaginas > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <button 
                                    onClick={() => cambiarPagina(paginaActual - 1)} 
                                    disabled={paginaActual === 1}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Anterior
                                </button>
                                <span className="text-sm font-semibold text-gray-600">
                                    Página {paginaActual} de {totalPaginas}
                                </span>
                                <button 
                                    onClick={() => cambiarPagina(paginaActual + 1)} 
                                    disabled={paginaActual === totalPaginas}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}

export default GestionOfertas;