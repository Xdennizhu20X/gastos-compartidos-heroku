const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  method: { type: String, required: true },
  bank: { type: String },
  accountNumber: { type: String },
  amount: { type: Number, required: true },  // Monto del pago
  reason: { type: String },
  cardNumber: { type: String },
  cardHolderName: { type: String },
  expirationDate: { type: Date },
  securityCode: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  email: { type: String },
  transaccion: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaccion', required: true },  // Referencia a la transacción
  date: { type: Date, default: Date.now },
  estado: { type: String, enum: ['pendiente', 'completado'], default: 'pendiente' }  // Agregar estado
});

module.exports = mongoose.model('Pago', pagoSchema);
