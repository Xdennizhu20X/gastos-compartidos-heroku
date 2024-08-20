const Pago = require('../models/pagoModel');
const Transaccion = require('../models/transaccionModel');
const Notificacion = require('../models/notificacionModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { enviarCorreo} = require('../utils/enviarCorreo');
// Obtener pagos por usuario
exports.getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const pagos = await Pago.find({ user: userId }).populate('user', 'nombre');
    res.status(200).json(pagos);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo pago
exports.createPayment = async (req, res) => {
  try {
    const {
      method,
      bank,
      accountNumber,
      amount,
      reason,
      cardNumber,
      cardHolderName,
      expirationDate,
      securityCode,
      userId,
      email,
      transaccionId
    } = req.body;

    // Verifica si el campo userId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    // Verifica si el campo transaccionId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(transaccionId)) {
      return res.status(400).json({ error: 'ID de transacción no válido' });
    }

    // Encuentra la transacción para obtener el monto
    const transaccion = await Transaccion.findById(transaccionId);
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    const newPago = new Pago({
      method,
      bank,
      accountNumber,
      amount: transaccion.monto, // Usa el monto de la transacción
      reason,
      cardNumber,
      cardHolderName,
      expirationDate,
      securityCode,
      user: userId,
      email,
      transaccion: transaccionId, // Asocia la transacción
      date: new Date(), // Registrar la fecha del pago
      estado: 'pendiente'
    });

    const savedPago = await newPago.save();

    // Crear una notificación para el usuario
    const mensaje = `Has realizado un pago de ${transaccion.monto.toFixed(2)}.`;
    const notificacion = new Notificacion({ usuario: userId, mensaje });
    await notificacion.save();

    res.status(201).json({ pagoId: newPago._id });
  } catch (err) {
    console.error('Error al crear el pago:', err);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
};

// Obtener pago por ID
exports.getPaymentById = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id).populate('user', 'nombre').populate('transaccion');
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.status(200).json(pago);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un pago
exports.updatePayment = async (req, res) => {
  try {
    const {
      method,
      bank,
      accountNumber,
      amount,
      reason,
      cardNumber,
      cardHolderName,
      expirationDate,
      securityCode,
      email
    } = req.body;

    const pago = await Pago.findByIdAndUpdate(
      req.params.id,
      { method, bank, accountNumber, amount, reason, cardNumber, cardHolderName, expirationDate, securityCode, email },
      { new: true }
    );

    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.status(200).json({ message: 'Pago actualizado exitosamente', pago });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un pago
exports.deletePayment = async (req, res) => {
  try {
    const pago = await Pago.findByIdAndDelete(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.status(200).json({ message: 'Pago eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.completePayment = async (req, res) => {
  try {
    const pagoId = req.params.id;

    // Encontrar el pago y poblar la transacción asociada
    const pago = await Pago.findById(pagoId).populate('transaccion');
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    // Verificar que el pago no esté ya completado
    if (pago.estado === 'completado') {
      return res.status(400).json({ error: 'El pago ya ha sido completado' });
    }

    // Actualizar el estado del pago a completado
    pago.estado = 'completado';
    await pago.save();

    // Eliminar la transacción asociada
    if (pago.transaccion) {
      await Transaccion.findByIdAndDelete(pago.transaccion._id);
    }

    // Crear una notificación para el usuario
    const mensaje = `Has completado el pago de ${pago.amount.toFixed(2)}.`;
    const notificacion = new Notificacion({ usuario: pago.user, mensaje });
    await notificacion.save();

    // Preparar los detalles del pago para el correo electrónico
    const paymentDetails = `
      Pago realizado con éxito:
      - Monto: $${pago.amount.toFixed(2)}
      - Método de pago: ${pago.method}
      - Banco: ${pago.bank || 'N/A'}
      - Número de cuenta: ${pago.accountNumber || 'N/A'}
      - Razón: ${pago.reason || 'N/A'}
      - Fecha de pago: ${pago.date.toLocaleDateString()} ${pago.date.toLocaleTimeString()}
    `;

    // Enviar correo electrónico al usuario con los detalles del pago
    await enviarCorreo(pago.email, 'Pago Completado', paymentDetails);

    return res.status(200).json({ message: 'Pago completado y transacción eliminada exitosamente', pago });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};