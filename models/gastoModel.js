const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  grupoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: true },  // Asegúrate de que este campo sea correcto
  fechaVencimiento: { type: Date, required: true },
  usuarioCreador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Gasto = mongoose.model('Gasto', gastoSchema);

module.exports = Gasto;
