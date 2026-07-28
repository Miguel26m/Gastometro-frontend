import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './servicios/api';

function Login() {
    const [email, asignarEmail] = useState('');
    const [password, asignarPassword] = useState('');
    const [error, asignarError] = useState('');
    const [erroresCampo, asignarErroresCampo] = useState({ email: '', password: '' });
    const [mostrarPassword, asignarMostrarPassword] = useState(false);

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

    // Valida el formulario y regresa true/false. Si hay errores, los guarda en erroresCampo.
    const validarFormulario = () => {
        const nuevosErrores = { email: '', password: '' };
        let esValido = true;

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            nuevosErrores.email = 'Completa este campo';
            esValido = false;
        } else if (!regexEmail.test(email)) {
            nuevosErrores.email = 'El correo debe tener un formato válido (ejemplo@dominio.com)';
            esValido = false;
        }

        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,;:!?@#$%^&*_\-+=]).{8,}$/;

        if (!password) {
            nuevosErrores.password = 'Completa este campo';
            esValido = false;
        } else if (!regexPassword.test(password)) {
            nuevosErrores.password = 'Mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y un carácter especial (ej. .)';
            esValido = false;
        }

        asignarErroresCampo(nuevosErrores);
        return esValido;
    };

    const manejarLogin = async (evento) => {
        evento.preventDefault();
        asignarError('');

        if (!validarFormulario()) {
            return;
        }

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

                    <form onSubmit={manejarLogin} noValidate className="flex flex-col gap-4">

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-center font-semibold text-base">Correo electronico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    asignarEmail(e.target.value);
                                    if (erroresCampo.email) {
                                        asignarErroresCampo((prev) => ({ ...prev, email: '' }));
                                    }
                                }}
                                placeholder="correo@ejemplo.com"
                                className="p-3 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-gray-500/60 focus:ring-2 focus:ring-white/50"
                            />
                            {erroresCampo.email && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center -mt-1">
                                    {erroresCampo.email}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-center font-semibold text-base">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        asignarPassword(e.target.value);
                                        if (erroresCampo.password) {
                                            asignarErroresCampo((prev) => ({ ...prev, password: '' }));
                                        }
                                    }}
                                    className="w-full p-3 pr-11 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-black/60 focus:ring-2 focus:ring-white/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => asignarMostrarPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {mostrarPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {erroresCampo.password && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center -mt-1">
                                    {erroresCampo.password}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="bg-black text-white p-3.5 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all mt-2 cursor-pointer shadow-md"
                        >
                            Entrar
                        </button>
                    </form>

                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Link to="/registro" className="text-white font-bold hover:underline text-sm">
                            Registrarse
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

export default Login;
