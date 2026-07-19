import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const libroInicial = {
  titulo: '',
  autor: '',
  categoria: '',
  anio: new Date().getFullYear(),
  stock: 1,
  disponible: true
};

const propuestaInicial = {
  titulo: '',
  autor: '',
  categoria: '',
  anio: new Date().getFullYear(),
  comentario: ''
};

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = useMemo(() => JSON.parse(localStorage.getItem('usuario') || '{}'), []);
  const esAdmin = usuario.rol === 'admin';
  const [libros, setLibros] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [form, setForm] = useState(libroInicial);
  const [propuesta, setPropuesta] = useState(propuestaInicial);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function cargar() {
    try {
      const [librosRes, solicitudesRes] = await Promise.all([
        api.get('/libros'),
        api.get('/solicitudes')
      ]);
      setLibros(librosRes.data);
      setSolicitudes(solicitudesRes.data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo cargar la informacion');
    }
  }

  useEffect(() => { cargar(); }, []);

  function salir() {
    localStorage.clear();
    navigate('/login');
  }

  function cambiar(event) {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function cambiarPropuesta(event) {
    const { name, value } = event.target;
    setPropuesta({ ...propuesta, [name]: value });
  }

  function editar(libro) {
    setEditando(libro._id);
    setForm({
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria,
      anio: libro.anio,
      stock: libro.stock,
      disponible: libro.disponible
    });
  }

  function cancelar() {
    setEditando(null);
    setForm(libroInicial);
  }

  async function guardar(event) {
    event.preventDefault();
    setError('');
    setMensaje('');

    try {
      const datos = { ...form, anio: Number(form.anio), stock: Number(form.stock) };
      if (editando) await api.put(`/libros/${editando}`, datos);
      else await api.post('/libros', datos);
      cancelar();
      setMensaje('Libro guardado correctamente.');
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el libro');
    }
  }

  async function eliminar(id) {
    if (!window.confirm('Eliminar este libro del catalogo?')) return;

    try {
      await api.delete(`/libros/${id}`);
      setMensaje('Libro eliminado correctamente.');
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo eliminar el libro');
    }
  }

  async function pedirLibro(libro) {
    setError('');
    setMensaje('');

    try {
      await api.post('/solicitudes', {
        tipo: 'prestamo',
        libro: libro._id,
        comentario: `Solicitud de prestamo para ${libro.titulo}`
      });
      setMensaje('Solicitud enviada. El administrador debe aprobarla.');
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo enviar la solicitud');
    }
  }

  async function enviarPropuesta(event) {
    event.preventDefault();
    setError('');
    setMensaje('');

    try {
      await api.post('/solicitudes', {
        tipo: 'aporte',
        libroPropuesto: {
          titulo: propuesta.titulo,
          autor: propuesta.autor,
          categoria: propuesta.categoria,
          anio: Number(propuesta.anio)
        },
        comentario: propuesta.comentario
      });
      setPropuesta(propuestaInicial);
      setMensaje('Propuesta enviada. El administrador debe revisarla.');
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo enviar la propuesta');
    }
  }

  async function revisarSolicitud(id, estado) {
    const respuestaAdmin = estado === 'aprobada' ? 'Solicitud aprobada.' : 'Solicitud rechazada.';

    try {
      await api.patch(`/solicitudes/${id}/revisar`, { estado, respuestaAdmin });
      setMensaje(`Solicitud ${estado}.`);
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo revisar la solicitud');
    }
  }

  async function devolverLibro(solicitudId) {
    setError('');
    setMensaje('');

    try {
      await api.patch(`/solicitudes/${solicitudId}/devolver`);
      setMensaje('Libro devuelto correctamente.');
      await cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo devolver el libro');
    }
  }

  function nombreSolicitud(solicitud) {
    if (solicitud.tipo === 'prestamo') return solicitud.libro?.titulo || 'Libro no disponible';
    return solicitud.libroPropuesto?.titulo || 'Libro propuesto';
  }

  return (
    <main className="dashboard">
      <header>
        <div>
          <p className="eyebrow">BIBLIOTECA DIGITAL</p>
          <h1>Gestion de biblioteca</h1>
          <p className="muted">Sesion: {usuario.email} | Rol: {esAdmin ? 'Administrador' : 'Usuario'}</p>
        </div>
        <button className="secondary" onClick={salir}>Cerrar sesion</button>
      </header>

      {(error || mensaje) && <p className={error ? 'notice' : 'success'}>{error || mensaje}</p>}

      <section className={esAdmin ? 'grid' : 'grid read-only'}>
        {esAdmin && (
          <form className="panel" onSubmit={guardar}>
            <h2>{editando ? 'Editar libro' : 'Nuevo libro'}</h2>
            <label>Titulo<input name="titulo" required minLength="2" value={form.titulo} onChange={cambiar} /></label>
            <label>Autor<input name="autor" required minLength="2" value={form.autor} onChange={cambiar} /></label>
            <label>Categoria<input name="categoria" required value={form.categoria} onChange={cambiar} /></label>
            <label>Año<input type="number" name="anio" required min="1000" max="2100" value={form.anio} onChange={cambiar} /></label>
            <label>Stock<input type="number" name="stock" required min="0" value={form.stock} onChange={cambiar} /></label>
            <label className="checkbox"><input type="checkbox" name="disponible" checked={form.disponible} onChange={cambiar} /> Disponible</label>
            <button>{editando ? 'Guardar cambios' : 'Crear libro'}</button>
            {editando && <button type="button" className="secondary" onClick={cancelar}>Cancelar</button>}
          </form>
        )}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Catalogo de libros</h2>
              <p className="muted">{esAdmin ? 'Puedes crear, editar y eliminar registros.' : 'Puedes pedir libros disponibles.'}</p>
            </div>
            <span className="badge">{libros.length} libros</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Autor</th>
                  <th>Categoria</th>
                  <th>Año</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {libros.map((item) => (
                  <tr key={item._id}>
                    <td>{item.titulo}</td>
                    <td>{item.autor}</td>
                    <td>{item.categoria}</td>
                    <td>{item.anio}</td>
                    <td>{item.stock}</td>
                    <td><span className={item.disponible ? 'status ok' : 'status off'}>{item.disponible ? 'Disponible' : 'No disponible'}</span></td>
                    <td>
                      {esAdmin ? (
                        <div className="actions">
                          <button className="small" onClick={() => editar(item)}>Editar</button>
                          <button className="small danger" onClick={() => eliminar(item._id)}>Eliminar</button>
                        </div>
                      ) : (
                        <button className="small" disabled={!item.disponible || item.stock <= 0} onClick={() => pedirLibro(item)}>Pedir</button>
                      )}
                    </td>
                  </tr>
                ))}
                {!libros.length && (
                  <tr>
                    <td colSpan="7" className="empty">Todavia no hay libros registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {!esAdmin && (
        <section className="grid bottom-grid">
          <form className="panel" onSubmit={enviarPropuesta}>
            <h2>Proponer libro</h2>
            <label>Titulo<input name="titulo" required minLength="2" value={propuesta.titulo} onChange={cambiarPropuesta} /></label>
            <label>Autor<input name="autor" required minLength="2" value={propuesta.autor} onChange={cambiarPropuesta} /></label>
            <label>Categoria<input name="categoria" required value={propuesta.categoria} onChange={cambiarPropuesta} /></label>
            <label>Año<input type="number" name="anio" required min="1000" max="2100" value={propuesta.anio} onChange={cambiarPropuesta} /></label>
            <label>Comentario<textarea name="comentario" maxLength="300" value={propuesta.comentario} onChange={cambiarPropuesta} /></label>
            <button>Enviar propuesta</button>
          </form>
          <SolicitudesPanel solicitudes={solicitudes} esAdmin={false} devolverLibro={devolverLibro} nombreSolicitud={nombreSolicitud} />
        </section>
      )}

      {esAdmin && (
        <section className="panel requests-panel">
          <SolicitudesPanel solicitudes={solicitudes} esAdmin revisarSolicitud={revisarSolicitud} devolverLibro={devolverLibro} nombreSolicitud={nombreSolicitud} />
        </section>
      )}
    </main>
  );
}

function SolicitudesPanel({ solicitudes, esAdmin, revisarSolicitud, devolverLibro, nombreSolicitud }) {
  return (
    <section className={esAdmin ? '' : 'panel'}>
      <div className="panel-heading">
        <div>
          <h2>{esAdmin ? 'Solicitudes de usuarios' : 'Mis solicitudes'}</h2>
          <p className="muted">{esAdmin ? 'Aprueba o rechaza pedidos y aportes.' : 'Consulta el estado de tus pedidos y propuestas.'}</p>
        </div>
        <span className="badge">{solicitudes.length}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Libro</th>
              {esAdmin && <th>Usuario</th>}
              <th>Estado</th>
              <th>Comentario</th>
              <th>Respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((item) => (
              <tr key={item._id}>
                <td>{item.tipo === 'prestamo' ? 'Pedido' : 'Aporte'}</td>
                <td>{nombreSolicitud(item)}</td>
                {esAdmin && <td>{item.usuario?.email}</td>}
                <td><span className={`status ${item.estado}`}>{item.devuelto ? 'Devuelto' : item.estado}</span></td>
                <td>{item.comentario || '-'}</td>
                <td>{item.respuestaAdmin || '-'}</td>
                <td>
                  {esAdmin && item.estado === 'pendiente' ? (
                    <div className="actions">
                      <button className="small" onClick={() => revisarSolicitud(item._id, 'aprobada')}>Aprobar</button>
                      <button className="small danger" onClick={() => revisarSolicitud(item._id, 'rechazada')}>Rechazar</button>
                    </div>
                  ) : !esAdmin && item.estado === 'aprobada' && item.tipo === 'prestamo' && !item.devuelto ? (
                    <button className="small" onClick={() => devolverLibro(item._id)}>Devolver</button>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {!solicitudes.length && (
              <tr>
                <td colSpan={esAdmin ? 7 : 6} className="empty">No hay solicitudes registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
