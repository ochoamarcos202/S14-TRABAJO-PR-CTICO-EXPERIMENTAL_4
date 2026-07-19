const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      trim: true,
      minlength: [2, 'El titulo debe tener al menos 2 caracteres']
    },
    autor: {
      type: String,
      required: [true, 'El autor es obligatorio'],
      trim: true,
      minlength: [2, 'El autor debe tener al menos 2 caracteres']
    },
    categoria: {
      type: String,
      required: [true, 'La categoria es obligatoria'],
      trim: true
    },
    anio: {
      type: Number,
      required: [true, 'El anio es obligatorio'],
      min: [1000, 'El anio no es valido'],
      max: [2100, 'El anio no es valido']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 1
    },
    disponible: {
      type: Boolean,
      default: true
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Libro', libroSchema);
