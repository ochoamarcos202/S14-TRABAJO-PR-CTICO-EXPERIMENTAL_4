const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

function sanitizarUsuario(usuario) {
  const objeto = usuario.toObject ? usuario.toObject() : { ...usuario };
  delete objeto.password;
  return objeto;
}

async function crearUsuario(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: passwordHash, rol: 'usuario' });
    return res.status(201).json(sanitizarUsuario(usuario));
  } catch (error) {
    return next(error);
  }
}

async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.find().sort({ fechaCreacion: -1 });
    return res.json(usuarios.map(sanitizarUsuario));
  } catch (error) {
    return next(error);
  }
}

async function obtenerUsuario(req, res, next) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return res.json(sanitizarUsuario(usuario));
  } catch (error) {
    return next(error);
  }
}

async function actualizarUsuario(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const datos = {};
    if (nombre) datos.nombre = nombre;
    if (email) datos.email = email;
    if (password) datos.password = await bcrypt.hash(password, 10);
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true
    });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return res.json(sanitizarUsuario(usuario));
  } catch (error) {
    return next(error);
  }
}

async function eliminarUsuario(req, res, next) {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { crearUsuario, listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario };
