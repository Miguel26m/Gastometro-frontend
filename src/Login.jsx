import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './servicios/api';

function Login() {
    const [email, asignarEmail] = useState('');
    const [password, asignarPassword] = useState('');
    const [error, asignarError] = useState('');

    const navegar = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token_acceso');
        const rolId = parseInt(sessionStorage.getItem('rol_id'));

        if (token) {
            if (rolId === 1) navegar('/admin');
            else if (rolId === 2) navegar('/cliente');
            else if (rolId === 3) navegar('/cazaofertas');
        }
    }, [navegar]);

    const manejarLogin = async (evento) => {
        evento.preventDefault();
        asignarError('');

        try {
            const respuesta = await api.post('/login', { email, password });

            const token = respuesta.data.token;
            const rolId = respuesta.data.usuario.rol_id;

            sessionStorage.setItem('token_acceso', token);
            sessionStorage.setItem('rol_id', rolId);

            if (rolId === 1) navegar('/admin');
            else if (rolId === 2) navegar('/cliente');
            else if (rolId === 3) navegar('/cazaofertas');
            else navegar('/cliente');

        } catch (falla) {
            asignarError('Correo o contraseña incorrectos');
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F8F2] flex items-center justify-center p-5">
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 w-full max-w-6xl">

                <div className="w-full flex justify-center">
                    <img
                        src="/logo.png"
                        alt="Logo Gastómetro"
                        className="w-full max-w-[880px] md:max-w-[1040px] object-contain"
                    />
                </div>

                <div className="bg-[#3EA341] p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-8">
                    <h2 className="text-white text-center text-3xl font-bold mb-1">Iniciar sesión</h2>

                    {error && (
                        <p className="text-red-500 text-center bg-white p-2 rounded-lg font-medium text-sm m-0">
                            {error}
                        </p>
                    )}

                    <form onSubmit={manejarLogin} className="flex flex-col gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-center font-semibold text-base">Correo electronico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => asignarEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="p-3 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-[#gray]/60 focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-center font-semibold text-base">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => asignarPassword(e.target.value)}
                                className="p-3 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-[#000000]/60 focus:ring-2 focus:ring-white/50"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-black text-white p-3.5 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all mt-2 cursor-pointer shadow-md"
                        >
                            Entrar
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => navegar('/registro')}
                        className="bg-transparent border-none text-white font-bold text-center mt-1 cursor-pointer hover:underline"
                    >
                        Registrarse
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;