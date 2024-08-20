const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceControllers');

// Crear un nuevo balance o actualizar uno existente
router.post('/balances', balanceController.createOrUpdateBalance);

// Obtener todos los balances (usando POST en lugar de GET)
router.post('/balances/all', balanceController.getAllBalances);

// Obtener un balance específico por ID (usando POST en lugar de GET)
router.post('/balances/:id', balanceController.getBalanceById);

// Actualizar un balance existente
router.put('/balances/:id', balanceController.updateBalance);

// Eliminar un balance por ID
router.delete('/balances/:id', balanceController.deleteBalance);

// controllers/balanceControllers.js

// Obtener todos los balances (con posibilidad de filtrar por grupo)
exports.getAllBalances = async (req, res) => {
    try {
      const { grupo } = req.body; // Cambiado a req.body
      const query = grupo ? { grupo } : {};
      const balances = await Balance.find(query);
      res.status(200).json(balances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = router;
