import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        localStorage.setItem(
          'usuario',
          JSON.stringify({
            id: decoded.id,
            nombre: decoded.nombre || 'Usuario Google',
            email: decoded.email,
            rol: decoded.rol
          })
        );
      } catch (err) {
        console.error('Error al decodificar el token OAuth:', err);
      }
    }
    navigate(token ? '/' : '/login?error=oauth', { replace: true });
  }, [navigate, params]);

  return <main className="auth-layout"><section className="auth-card"><p>Completando inicio de sesión…</p></section></main>;
}
