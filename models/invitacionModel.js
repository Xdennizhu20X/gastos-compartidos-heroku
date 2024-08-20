const mongoose = require('mongoose');
const Usuario = require('./usuarioModel');
const Grupo = require('./grupoModel');

const InvitacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  grupo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupo',
    required: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aceptada', 'rechazada'],
    default: 'pendiente',
  },
  fechaEnvio: {
    type: Date,
    default: Date.now,
  },
  fechaRespuesta: {
    type: Date,
  },
});

const Invitacion = mongoose.model('Invitacion', InvitacionSchema);

module.exports = Invitacion;
