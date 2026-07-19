const Libro = require('../models/Libro');
const Solicitud = require('../models/Solicitud');

async function crearLibro(req, res, next) {
  try {
    const libro = await Libro.create(req.body);
    return res.status(201).json(libro);
  } catch (error) {
    return next(error);
  }
}

async function listarLibros(req, res, next) {
  try {
    const libros = await Libro.find().sort({ fechaCreacion: -1 });
    return res.json(libros);
  } catch (error) {
    return next(error);
  }
}

async function obtenerLibro(req, res, next) {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    return res.json(libro);
  } catch (error) {
    return next(error);
  }
}

async function actualizarLibro(req, res, next) {
  try {
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    return res.json(libro);
  } catch (error) {
    return next(error);
  }
}

async function eliminarLibro(req, res, next) {
  try {
    const pendientes = await Solicitud.countDocuments({ libro: req.params.id, estado: 'pendiente' });
    if (pendientes > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar un libro con solicitudes pendientes' });
    }

    const libro = await Libro.findByIdAndDelete(req.params.id);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { crearLibro, listarLibros, obtenerLibro, actualizarLibro, eliminarLibro };
