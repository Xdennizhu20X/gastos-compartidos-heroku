const mongoose = require('mongoose');

const GrupoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  integrantes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario', // Referencia al modelo Usuario
    }
  ],
  descripcion: {
    type: String,
  },
  presupuesto: {
    type: Number,
  }
});

const Grupo = mongoose.model('Grupo', GrupoSchema);

module.exports = Grupo;
  