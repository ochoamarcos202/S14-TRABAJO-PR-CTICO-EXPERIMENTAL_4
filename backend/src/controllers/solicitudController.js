const Libro = require('../models/Libro');
const Solicitud = require('../models/Solicitud');

const populateSolicitud = [
  { path: 'usuario', select: 'nombre email rol' },
  { path: 'libro', select: 'titulo autor categoria anio stock disponible' }
];

function validarLibroPropuesto(libroPropuesto = {}) {
  return libroPropuesto.titulo && libroPropuesto.autor && libroPropuesto.categoria && libroPropuesto.anio;
}

async function crearSolicitud(req, res, next) {
  try {
    const { tipo, libro, libroPropuesto, comentario } = req.body;

    if (tipo === 'prestamo') {
      const libroEncontrado = await Libro.findById(libro);
      if (!libroEncontrado) return res.status(404).json({ mensaje: 'Libro no encontrado' });
      if (!libroEncontrado.disponible || libroEncontrado.stock <= 0) {
        return res.status(400).json({ mensaje: 'El libro no esta disponible' });
      }
    }

    if (tipo === 'aporte' && !validarLibroPropuesto(libroPropuesto)) {
      return res.status(400).json({ mensaje: 'Completa los datos del libro propuesto' });
    }

    const solicitud = await Solicitud.create({
      tipo,
      libro: tipo === 'prestamo' ? libro : undefined,
      libroPropuesto: tipo === 'aporte' ? libroPropuesto : undefined,
      comentario,
      usuario: req.usuario.id
    });

    await solicitud.populate(populateSolicitud);
    return res.status(201).json(solicitud);
  } catch (error) {
    return next(error);
  }
}

async function listarSolicitudes(req, res, next) {
  try {
    const filtro = req.usuario.rol === 'admin' ? {} : { usuario: req.usuario.id };
    const solicitudes = await Solicitud.find(filtro).populate(populateSolicitud).sort({ fechaCreacion: -1 });
    return res.json(solicitudes);
  } catch (error) {
    return next(error);
  }
}

async function revisarSolicitud(req, res, next) {
  try {
    const { estado, respuestaAdmin } = req.body;
    if (!['aprobada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ mensaje: 'El estado debe ser aprobada o rechazada' });
    }

    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    if (solicitud.estado !== 'pendiente') {
      return res.status(400).json({ mensaje: 'La solicitud ya fue revisada' });
    }

    if (estado === 'aprobada' && solicitud.tipo === 'prestamo') {
      const libro = await Libro.findOneAndUpdate(
        { _id: solicitud.libro, stock: { $gt: 0 } },
        { $inc: { stock: -1 } },
        { new: true }
      );

      if (!libro) {
        return res.status(400).json({ mensaje: 'El libro ya no esta disponible' });
      }

      if (libro.stock === 0) {
        await Libro.updateOne({ _id: libro._id }, { $set: { disponible: false } });
      }
    }

    if (estado === 'aprobada' && solicitud.tipo === 'aporte') {
      await Libro.create({
        ...solicitud.libroPropuesto,
        stock: 1,
        disponible: true
      });
    }

    solicitud.estado = estado;
    solicitud.respuestaAdmin = respuestaAdmin;
    solicitud.fechaRevision = new Date();
    await solicitud.save();
    await solicitud.populate(populateSolicitud);

    return res.json(solicitud);
  } catch (error) {
    return next(error);
  }
}

async function devolverLibro(req, res, next) {
  try {
    const filtro = req.usuario.rol === 'admin' ? { _id: req.params.id } : { _id: req.params.id, usuario: req.usuario.id };
    const solicitud = await Solicitud.findOne(filtro);
    if (!solicitud) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    if (solicitud.estado !== 'aprobada') {
      return res.status(400).json({ mensaje: 'Solo se pueden devolver libros con solicitudes aprobadas' });
    }
    if (solicitud.tipo !== 'prestamo') {
      return res.status(400).json({ mensaje: 'Solo las solicitudes de prestamo pueden devolverse' });
    }
    if (solicitud.devuelto) {
      return res.status(400).json({ mensaje: 'El libro ya fue devuelto' });
    }

    const libro = await Libro.findOneAndUpdate(
      { _id: solicitud.libro },
      { $inc: { stock: 1 } },
      { new: true }
    );

    if (libro.stock > 0 && !libro.disponible) {
      await Libro.updateOne({ _id: libro._id }, { $set: { disponible: true } });
    }

    solicitud.devuelto = true;
    solicitud.fechaDevolucion = new Date();
    await solicitud.save();
    await solicitud.populate(populateSolicitud);

    return res.json(solicitud);
  } catch (error) {
    return next(error);
  }
}

module.exports = { crearSolicitud, listarSolicitudes, revisarSolicitud, devolverLibro };
