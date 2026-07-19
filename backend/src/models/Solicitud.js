const mongoose = require('mongoose');

const libroPropuestoSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true },
    autor: { type: String, trim: true },
    categoria: { type: String, trim: true },
    anio: { type: Number, min: 1000, max: 2100 }
  },
  { _id: false }
);

const solicitudSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['prestamo', 'aporte'],
      required: [true, 'El tipo de solicitud es obligatorio']
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aprobada', 'rechazada'],
      default: 'pendiente'
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    libro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Libro'
    },
    libroPropuesto: libroPropuestoSchema,
    comentario: {
      type: String,
      trim: true,
      maxlength: [300, 'El comentario no puede superar 300 caracteres']
    },
    respuestaAdmin: {
      type: String,
      trim: true,
      maxlength: [300, 'La respuesta no puede superar 300 caracteres']
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    },
    fechaRevision: Date,
    devuelto: {
      type: Boolean,
      default: false
    },
    fechaDevolucion: Date
  },
  { versionKey: false }
);

module.exports = mongoose.model('Solicitud', solicitudSchema);
