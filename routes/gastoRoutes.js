const express = require('express');
const router = express.Router();

const { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, getExpensesByUserId } = require('../controllers/gastoControllers');

router.post('/gastos',  createExpense);
router.post('/gastos/all', getAllExpenses);
router.post('/gastos/:id',  getExpenseById);
router.post('/gastos/update/:id', updateExpense);
router.post('/gastos/delete/:id',  deleteExpense);
router.post('/gastos/usuario/:userId', getExpensesByUserId);

module.exports = router;
