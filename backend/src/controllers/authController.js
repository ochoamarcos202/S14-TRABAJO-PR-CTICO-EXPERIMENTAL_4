const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function me(req, res) {
  return res.json({
    id: req.usuario.id,
    nombre: req.usuario.nombre,
    email: req.usuario.email,
    rol: req.usuario.rol
  });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select('+password');
    const contraseñaValida = usuario && await bcrypt.compare(password, usuario.password);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id.toString(), email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, me };
