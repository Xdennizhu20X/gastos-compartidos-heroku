const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  mensaje: { type: String, required: true },
  leido: { type: Boolean, default: false }, // Indica si la notificación ha sido leída
  fechaCreacion: { type: Date, default: Date.now }
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
module.exports = Notificacion;
