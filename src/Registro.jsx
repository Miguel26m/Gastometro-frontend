import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './servicios/api';

function Registro() {
    const [name, asignarName] = useState('');
    const [email, asignarEmail] = useState('');
    const [telefono, asignarTelefono] = useState('');
    const [password, asignarPassword] = useState('');
    const [passwordConfirmation, asignarPasswordConfirmation] = useState('');
    const [error, asignarError] = useState('');

    const navegar = useNavigate();

    const manejarRegistro = async (evento) => {
        evento.preventDefault();
        asignarError('');

        if (password !== passwordConfirmation) {
            asignarError('Las contraseñas no coinciden');
            return;
        }

        try {
            const respuesta = await api.post('/registro', {
                name,
                email,
                telefono,
                password,
                password_confirmation: passwordConfirmation,
                rol_id: 2
            });

            if (respuesta.data.token) {
                sessionStorage.setItem('token_acceso', respuesta.data.token);
                sessionStorage.setItem('rol_id', '2');
            }

            navegar('/cliente');

        } catch (falla) {
            asignarError('Error al registrarse. Verifica los datos.');
            console.error(falla);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F8F2] flex items-center justify-center p-5">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full max-w-5xl">

                <div className="w-full flex justify-center">
                    <img
                        src="/logo.png"
                        alt="Logo Gastómetro"
                        className="w-[380px] md:w-[480px] h-auto object-contain"
                    />
                </div>

                <div className="bg-[#3EA341] p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
                    <h2 className="text-white text-center text-3xl font-bold mb-1">Regístrate</h2>

                    {error && (
                        <p className="text-red-500 text-center bg-white p-2 rounded-lg font-medium text-sm m-0">
                            {error}
                        </p>
                    )}

                    <form onSubmit={manejarRegistro} className="flex flex-col gap-3">

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Nombre de usuario</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => asignarName(e.target.value)}
                                placeholder="NOMBRE COMPLETO"
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center text-sm font-bold outline-none placeholder-[#gray]/60 focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Correo electronico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => asignarEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-[#gray]/60 focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Número de telefono</label>
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => asignarTelefono(e.target.value)}
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => asignarPassword(e.target.value)}
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Confirmar contraseña</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => asignarPasswordConfirmation(e.target.value)}
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-black text-white p-3 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all mt-2 cursor-pointer shadow-md"
                        >
                            Registrarse
                        </button>
                    </form>

                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Link to="/Login" className="text-white font-bold hover:underline text-sm">
                            Ir al login
                        </Link>

                        <span className="text-green-200">|</span>

                        <Link to="/InicioPublico" className="text-white font-bold hover:underline text-sm">
                            Ir al inicio
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Registro;