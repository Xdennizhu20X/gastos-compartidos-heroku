const mongoose = require('mongoose');
const Usuario = require('./usuarioModel');
const Grupo = require('./grupoModel');
const Gasto = require('./gastoModel');

const TransaccionSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
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
  gasto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gasto',
    required: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagada'],
    default: 'pendiente',
  },
});

const Transaccion = mongoose.model('Transaccion', TransaccionSchema);

module.exports = Transaccion;
