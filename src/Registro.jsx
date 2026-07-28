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
    const [erroresCampo, asignarErroresCampo] = useState({
        name: '',
        email: '',
        telefono: '',
        password: '',
        passwordConfirmation: ''
    });
    const [mostrarPassword, asignarMostrarPassword] = useState(false);
    const [mostrarPasswordConfirmation, asignarMostrarPasswordConfirmation] = useState(false);

    const navegar = useNavigate();

    const limpiarErrorCampo = (campo) => {
        if (erroresCampo[campo]) {
            asignarErroresCampo((prev) => ({ ...prev, [campo]: '' }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = { name: '', email: '', telefono: '', password: '', passwordConfirmation: '' };
        let esValido = true;

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,;:!?@#$%^&*_\-+=]).{8,}$/;
        const regexTelefono = /^\d{10}$/;

        if (!name.trim()) {
            nuevosErrores.name = 'Completa este campo';
            esValido = false;
        }

        if (!email.trim()) {
            nuevosErrores.email = 'Completa este campo';
            esValido = false;
        } else if (!regexEmail.test(email)) {
            nuevosErrores.email = 'El correo debe tener un formato válido (ejemplo@dominio.com)';
            esValido = false;
        }

        if (!telefono.trim()) {
            nuevosErrores.telefono = 'Completa este campo';
            esValido = false;
        } else if (!regexTelefono.test(telefono)) {
            nuevosErrores.telefono = 'El teléfono debe tener 10 dígitos, sin espacios ni guiones';
            esValido = false;
        }

        if (!password) {
            nuevosErrores.password = 'Completa este campo';
            esValido = false;
        } else if (!regexPassword.test(password)) {
            nuevosErrores.password = 'Mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y un carácter especial (ej. .)';
            esValido = false;
        }

        if (!passwordConfirmation) {
            nuevosErrores.passwordConfirmation = 'Completa este campo';
            esValido = false;
        } else if (password && passwordConfirmation !== password) {
            nuevosErrores.passwordConfirmation = 'Las contraseñas no coinciden';
            esValido = false;
        }

        asignarErroresCampo(nuevosErrores);
        return esValido;
    };

    const manejarRegistro = async (evento) => {
        evento.preventDefault();
        asignarError('');

        if (!validarFormulario()) {
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

                    <form onSubmit={manejarRegistro} noValidate className="flex flex-col gap-3">

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Nombre de usuario</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    asignarName(e.target.value);
                                    limpiarErrorCampo('name');
                                }}
                                placeholder="NOMBRE COMPLETO"
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center text-sm font-bold outline-none placeholder-gray-500/60 focus:ring-2 focus:ring-white/50"
                            />
                            {erroresCampo.name && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center">
                                    {erroresCampo.name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Correo electronico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    asignarEmail(e.target.value);
                                    limpiarErrorCampo('email');
                                }}
                                placeholder="correo@ejemplo.com"
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-gray-500/60 focus:ring-2 focus:ring-white/50"
                            />
                            {erroresCampo.email && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center">
                                    {erroresCampo.email}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Número de telefono</label>
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => {
                                    asignarTelefono(e.target.value);
                                    limpiarErrorCampo('telefono');
                                }}
                                placeholder="10 dígitos"
                                className="p-2.5 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none placeholder-gray-500/60 focus:ring-2 focus:ring-white/50"
                            />
                            {erroresCampo.telefono && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center">
                                    {erroresCampo.telefono}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        asignarPassword(e.target.value);
                                        limpiarErrorCampo('password');
                                    }}
                                    className="w-full p-2.5 pr-11 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => asignarMostrarPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {mostrarPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {erroresCampo.password && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center">
                                    {erroresCampo.password}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-white text-center font-semibold text-sm">Confirmar contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarPasswordConfirmation ? 'text' : 'password'}
                                    value={passwordConfirmation}
                                    onChange={(e) => {
                                        asignarPasswordConfirmation(e.target.value);
                                        limpiarErrorCampo('passwordConfirmation');
                                    }}
                                    className="w-full p-2.5 pr-11 border-none rounded-xl bg-[#E8F0E8] text-[#000000] text-center font-bold outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => asignarMostrarPasswordConfirmation((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    aria-label={mostrarPasswordConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {mostrarPasswordConfirmation ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {erroresCampo.passwordConfirmation && (
                                <span className="text-red-500 bg-white text-xs font-semibold rounded-md px-2 py-1 text-center">
                                    {erroresCampo.passwordConfirmation}
                                </span>
                            )}
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
