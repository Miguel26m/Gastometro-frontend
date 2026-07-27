import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import PanelCliente from './clientes/PanelCliente';
import PanelCazaofertas from "./cazaofertas/PanelCazaofertas";
import PanelAdmin from "./administrador/PanelAdmin";
import Registro from './Registro';

function RutaProtegida({ children, rolPermitido }) {
    const token = sessionStorage.getItem('token_acceso');
    const rolId = parseInt(sessionStorage.getItem('rol_id'));

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (rolPermitido && rolId !== rolPermitido) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registro />} />

                <Route
                    path="/cliente"
                    element={
                        <RutaProtegida rolPermitido={2}>
                            <PanelCliente />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/cazaofertas"
                    element={
                        <RutaProtegida rolPermitido={3}>
                            <PanelCazaofertas />
                        </RutaProtegida>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <RutaProtegida rolPermitido={1}>
                            <PanelAdmin />
                        </RutaProtegida>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;