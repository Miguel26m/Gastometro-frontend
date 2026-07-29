import { useState } from 'react';
import api from '../servicios/api';

function Configuracion({ usuario, asignarUsuario }) {
    const [telefono, asignarTelefono] = useState(usuario.telefono || '');
    const [presupuesto, asignarPresupuesto] = useState(usuario.presupuesto ?? '');
    const [guardando, asignarGuardando] = useState(false);
    const [mensaje, asignarMensaje] = useState(null); // { tipo: 'exito' | 'error', texto: '' }

    const guardarCambios = async (evento) => {
        evento.preventDefault();
        asignarGuardando(true);
        asignarMensaje(null);

        try {
            const respuesta = await api.put('/user/perfil', {
                telefono: telefono || null,
                presupuesto: presupuesto === '' ? null : presupuesto,
            });

            asignarUsuario((previo) => ({ ...previo, ...respuesta.data.user }));
            asignarMensaje({ tipo: 'exito', texto: 'Tus datos se guardaron correctamente.' });
        } catch (falla) {
            const textoError = falla.response?.data?.message || 'No se pudieron guardar los cambios. Intenta de nuevo.';
            asignarMensaje({ tipo: 'error', texto: textoError });
        } finally {
            asignarGuardando(false);
        }
    };

    return (
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#43a047] mb-6">Ajustes de cuenta</h2>

            {mensaje && (
                <p className={`text-sm font-semibold p-3 rounded-lg mb-4 ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {mensaje.texto}
                </p>
            )}

            <form onSubmit={guardarCambios} className="flex flex-col gap-5">
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
                    <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => asignarTelefono(e.target.value)}
                        placeholder="Ej. 9511234567"
                        maxLength={20}
                        className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">Límite de presupuesto mensual</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={presupuesto}
                        onChange={(e) => asignarPresupuesto(e.target.value)}
                        placeholder="Ej. 1500.00"
                        className="p-2.5 border border-gray-300 rounded-lg focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={guardando}
                    className="mt-2 bg-black text-white p-3 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {guardando ? 'Guardando...' : 'Actualizar datos'}
                </button>
            </form>
        </div>
    );
}

export default Configuracion;