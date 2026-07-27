import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((configuracion) => {
    const token_guardado = sessionStorage.getItem('token_acceso');
    if (token_guardado) {
        configuracion.headers.Authorization = `Bearer ${token_guardado}`;
    }
    return configuracion;
});

export default api;