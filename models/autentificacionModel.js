const mongoose = require('mongoose');
const Usuario = require('./usuarioModel'); // Asegúrate de tener este modelo

const AutentificacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  contrasenia: {
    type: String,
    required: true,
  },
});

const Autentificacion = mongoose.model('Autentificacion', AutentificacionSchema);

module.exports = Autentificacion;
