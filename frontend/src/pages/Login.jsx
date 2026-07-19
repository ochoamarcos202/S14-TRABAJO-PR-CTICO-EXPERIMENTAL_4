import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [params] = useState(new URLSearchParams(window.location.search));
  const [modoRegistro, setModoRegistro] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState(params.get('error') === 'oauth' ? 'El inicio de sesion con Google fallo. Intenta de nuevo.' : '');
  const [cargando, setCargando] = useState(false);

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function enviar(event) {
    event.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (modoRegistro) {
        await api.post('/usuarios', form);
        setModoRegistro(false);
        setError('Registro correcto. Ahora inicia sesion.');
      } else {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo completar la operacion');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <p className="eyebrow">BIBLIOTECA DIGITAL</p>
        <h1>{modoRegistro ? 'Crear cuenta' : 'Bienvenido'}</h1>
        <p className="muted">{modoRegistro ? 'Registrate como usuario para consultar el catalogo.' : 'Inicia sesion para entrar al sistema.'}</p>
        <form onSubmit={enviar}>
          {modoRegistro && <label>Nombre<input name="nombre" required minLength="2" value={form.nombre} onChange={cambiar} /></label>}
          <label>Email<input type="email" name="email" required value={form.email} onChange={cambiar} /></label>
          <label>Contrasena<input type="password" name="password" required minLength="6" value={form.password} onChange={cambiar} /></label>
          {error && <p className="notice">{error}</p>}
          <button disabled={cargando}>{cargando ? 'Procesando...' : modoRegistro ? 'Registrarme' : 'Iniciar sesion'}</button>
        </form>
        <button className="secondary" onClick={() => { setModoRegistro(!modoRegistro); setError(''); }}>
          {modoRegistro ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
        </button>
        <a className="google" href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`}>Continuar con Google</a>
      </section>
    </main>
  );
}
