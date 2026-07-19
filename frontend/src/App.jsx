import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OAuthCallback from './pages/OAuthCallback';

function RutaProtegida({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/oauth/callback" element={<OAuthCallback />} />
    <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
