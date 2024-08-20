const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Obtener pagos por usuario
router.post('/pagos/usuario/:userId', pagoController.getPaymentsByUser);

// Crear un nuevo pago
router.post('/pagos', pagoController.createPayment);

// Obtener pago por ID
router.post('/pagos/:id', pagoController.getPaymentById);

// Actualizar un pago
router.post('/pagos/update/:id', pagoController.updatePayment);

// Eliminar un pago
router.post('/pagos/delete/:id', pagoController.deletePayment);

// Marcar un pago como completado
router.post('/pagos/:id/completar', pagoController.completePayment);

module.exports = router;
