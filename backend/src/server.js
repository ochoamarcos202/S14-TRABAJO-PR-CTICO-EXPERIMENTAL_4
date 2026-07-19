require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const connectDatabase = require('./config/db');
const configurarPassport = require('./config/passport');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const libroRoutes = require('./routes/libroRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || '*'}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'desarrollo-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' }
}));
configurarPassport();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.json({
  mensaje: 'API Unidad 4 funcionando',
  health: '/health',
  endpoints: {
    login: 'POST /auth/login',
    usuarios: '/usuarios',
    libros: '/libros',
    solicitudes: '/solicitudes',
    oauthGoogle: 'GET /auth/google'
  }
}));
app.get('/health', (req, res) => res.json({ estado: 'ok' }));
app.use('/usuarios', usuarioRoutes);
app.use('/libros', libroRoutes);
app.use('/solicitudes', solicitudRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use((error, req, res, next) => {
  if (error.code === 11000) return res.status(409).json({ mensaje: 'El email ya está registrado' });
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ mensaje: 'Datos inválidos', errores: Object.values(error.errors).map((item) => item.message) });
  }
  if (error instanceof mongoose.Error.CastError) return res.status(400).json({ mensaje: 'ID de usuario inválido' });
  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
});

async function iniciarServidor() {
  await connectDatabase();
  app.listen(port, () => console.log(`Servidor ejecutándose en http://localhost:${port}`));
}

if (require.main === module) {
  iniciarServidor().catch((error) => {
    console.error(`No se pudo iniciar el servidor: ${error.message}`);
    process.exit(1);
  });
}

module.exports = app;
