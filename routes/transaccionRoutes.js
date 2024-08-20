const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  pagarTransaccion,
  getTransactionsByUserId
} = require('../controllers/transaccionControllers');

// Ruta para crear una nueva transacción
router.post('/transaccion', createTransaction);

// Ruta para obtener todas las transacciones
router.post('/transaccion/all', getAllTransactions);

// Ruta para obtener una transacción por ID
router.post('/transaccion/:id', getTransactionById);

// Ruta para actualizar una transacción
router.post('/transaccion/:id/update', updateTransaction);

// Ruta para eliminar una transacción
router.post('/transaccion/:id/delete', deleteTransaction);

// Ruta para marcar una transacción como pagada
router.post('/transaccion/:id/pagar', pagarTransaccion);

router.post('/transaccion/user/:userId', getTransactionsByUserId);
module.exports = router;
