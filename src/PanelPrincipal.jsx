import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './servicios/api';

function PanelPrincipal() {
    const [vistaActual, asignarVistaActual] = useState('Inicio');
    const [plataformas, asignarPlataformas] = useState([]);
    const [misSuscripciones, asignarMisSuscripciones] = useState([]);
    const [promociones, asignarPromociones] = useState([]);
    const [usuario, asignarUsuario] = useState({ name: '', email: '', telefono: '', presupuesto: '' });
    
    const [mostrarModal, asignarMostrarModal] = useState(false);
    const [plataformaSeleccionada, asignarPlataformaSeleccionada] = useState('');
    const [costo, asignarCosto] = useState('');
    const [diaCorte, asignarDiaCorte] = useState('');
    const [error, asignarError] = useState('');

    const navegar = useNavigate();

    const preciosBase = {
        'Netflix': 219.00,
        'Spotify': 129.00,
        'Amazon Prime': 99.00,
        'Disney+': 179.00,
        'Max': 149.00,
        'YouTube Premium': 139.00,
        'Crunchyroll': 119.00
    };

    useEffect(() => {
        obtenerDatosUsuario();
        obtenerPlataformas();
        obtenerMisSuscripciones();
        obtenerPromociones();
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const respuesta = await api.get('/user');
            asignarUsuario(respuesta.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const obtenerPlataformas = async () => {
        try {
            const respuesta = await api.get('/plataformas');
            asignarPlataformas(respuesta.data.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const obtenerMisSuscripciones = async () => {
        try {
            const respuesta = await api.get('/mis-suscripciones');
            asignarMisSuscripciones(respuesta.data.data || respuesta.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const obtenerPromociones = async () => {
        try {
            const respuesta = await api.get('/promociones');
            asignarPromociones(respuesta.data.data);
        } catch (falla) {
            console.error(falla);
        }
    };

    const manejarSeleccionPlataforma = (evento) => {
        const idPlataforma = evento.target.value;
        asignarPlataformaSeleccionada(idPlataforma);

        const plataformaEncontrada = plataformas.find(p => p.id.toString() === idPlataforma);
        
        if (plataformaEncontrada && preciosBase[plataformaEncontrada.nombre]) {
            asignarCosto(preciosBase[plataformaEncontrada.nombre]);
        } else {
            asignarCosto('');
        }
    };

    const agregarSuscripcion = async (evento) => {
        evento.preventDefault();
        asignarError('');

        try {
            await api.post('/mis-suscripciones', {
                plataforma_id: plataformaSeleccionada,
                costo_personalizado: costo,
                dia_corte: diaCorte
            });
            
            asignarPlataformaSeleccionada('');
            asignarCosto('');
            asignarDiaCorte('');
            asignarMostrarModal(false);
            obtenerMisSuscripciones();
            
        } catch (falla) {
            asignarError('Error al guardar la suscripción');
        }
    };

    const eliminarSuscripcion = async (id) => {
        try {
            await api.delete(`/mis-suscripciones/${id}`);
            obtenerMisSuscripciones();
        } catch (falla) {
            console.error(falla);
        }
    };

    const cerrarSesion = async () => {
        try {
            await api.post('/logout');
        } catch (falla) {
            console.error(falla);
        } finally {
            localStorage.removeItem('token_acceso');
            navegar('/');
        }
    };

    const totalGasto = misSuscripciones.reduce((suma, sub) => suma + parseFloat(sub.pivot.costo_personalizado), 0);

    return (
        <div>
            <div>
                <h2>GASTOMETRO</h2>
                <nav>
                    <button onClick={() => asignarVistaActual('Inicio')}>Inicio</button>
                    <button onClick={() => asignarVistaActual('Suscripciones')}>Suscripciones</button>
                    <button onClick={() => asignarVistaActual('Promociones')}>Promociones</button>
                    <button onClick={() => asignarVistaActual('Configuracion')}>Configuración</button>
                </nav>
                <div>
                    <p>{usuario.name}</p>
                    <button onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
            </div>

            <div>
                <header>
                    <span>{vistaActual.toUpperCase()}</span>
                    {vistaActual === 'Suscripciones' && (
                        <span>Gasto Mensual Total: ${totalGasto.toFixed(2)}</span>
                    )}
                    <input type="text" placeholder="BUSCAR REGISTROS" />
                    <span>👤 {usuario.name}</span>
                </header>

                <main>
                    {vistaActual === 'Inicio' && (
                        <div>
                            <h1>BIENVENIDO {usuario.name}</h1>
                            <div>
                                <button onClick={() => asignarMostrarModal(true)}>
                                    + Agregar suscripción
                                </button>
                            </div>
                            <div>
                                <p>No hay alertas ahora</p>
                            </div>
                        </div>
                    )}

                    {vistaActual === 'Suscripciones' && (
                        <div>
                            <h2>Mis Suscripciones</h2>
                            <button onClick={() => asignarMostrarModal(true)}>Agregar suscripción +</button>
                            
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Plataforma</th>
                                        <th>Categoría</th>
                                        <th>Costo mensual</th>
                                        <th>Próximo cobro</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {misSuscripciones.map((sub) => (
                                        <tr key={sub.id}>
                                            <td>{sub.nombre}</td>
                                            <td>{sub.categoria || 'Streaming'}</td>
                                            <td>${sub.pivot.costo_personalizado}</td>
                                            <td>{sub.pivot.dia_corte}/Mes Actual/2026</td>
                                            <td>Activo</td>
                                            <td>
                                                <button>Editar</button>
                                                <button onClick={() => eliminarSuscripcion(sub.id)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {vistaActual === 'Promociones' && (
                        <div>
                            <h2>PROMOCIÓN EN TIEMPO REAL</h2>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Plataforma</th>
                                        <th>Suscripción</th>
                                        <th>Categoria</th>
                                        <th>Precio</th>
                                        <th>Fin de la promoción</th>
                                        <th>Ir a la promoción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promociones.length === 0 ? (
                                        <tr>
                                            <td colSpan="6">Cargando datos de la API externa...</td>
                                        </tr>
                                    ) : (
                                        promociones.map((promo) => (
                                            <tr key={promo.id}>
                                                <td>{promo.plataforma}</td>
                                                <td>{promo.suscripcion}</td>
                                                <td>{promo.categoria}</td>
                                                <td>${promo.precio}</td>
                                                <td>{promo.fin_promocion}</td>
                                                <td><a href={promo.link} target="_blank" rel="noreferrer">Link</a></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {vistaActual === 'Configuracion' && (
                        <div>
                            <form>
                                <div>
                                    <label>Cambiar correo</label>
                                    <input type="email" defaultValue={usuario.email} />
                                </div>
                                <div>
                                    <label>Numero de telefono</label>
                                    <input type="tel" defaultValue={usuario.telefono || ''} />
                                </div>
                                <div>
                                    <label>Presupuesto del mes</label>
                                    <input type="number" step="0.01" defaultValue={usuario.presupuesto || ''} />
                                </div>
                                <button type="button">Guardar cambios</button>
                            </form>
                        </div>
                    )}
                </main>
            </div>

            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <h2>Agregar nueva suscripción</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={agregarSuscripcion}>
                            <div>
                                <select 
                                    value={plataformaSeleccionada} 
                                    onChange={manejarSeleccionPlataforma}
                                    required
                                >
                                    <option value="">Selecciona una plataforma...</option>
                                    {plataformas.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Costo mensual" 
                                    value={costo}
                                    onChange={(e) => asignarCosto(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="31" 
                                    placeholder="Día de cobro" 
                                    value={diaCorte}
                                    onChange={(e) => asignarDiaCorte(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Agregar al total</button>
                            <button type="button" onClick={() => asignarMostrarModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PanelPrincipal;