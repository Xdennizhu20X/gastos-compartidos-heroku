const mongoose = require('mongoose');
const moment = require('moment'); // Para facilitar el manejo de fechas

const BalanceSchema = new mongoose.Schema({
  presupuesto: {
    type: Number,
    required: true,
  },
  gastosTotales: {
    type: Number,
    default: 0,
  },
  balancefn: {
    type: Number,
    default: function() {
      return this.presupuesto - this.gastosTotales;
    },
  },
  grupo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupo',
    required: true,
  },
  mes: {
    type: String, // Formato "YYYY-MM"
    required: true,
  },
});

// Método para actualizar los gastos totales del mes actual
BalanceSchema.methods.updateGastosMensuales = async function() {
  const Gasto = mongoose.model('Gasto');
  
  // Obtener la fecha de inicio y fin del mes especificado
  const inicioMes = moment(this.mes, 'YYYY-MM').startOf('month').toDate();
  const finMes = moment(this.mes, 'YYYY-MM').endOf('month').toDate();

  // Agregar filtro de fecha para el mes actual
  const gastos = await Gasto.aggregate([
    { $match: { 
        grupo: this.grupo,
        fecha: { $gte: inicioMes, $lte: finMes }  // Filtra los gastos dentro del mes actual
      } 
    },
    { $group: { _id: null, total: { $sum: '$precio' } } }
  ]);

  this.gastosTotales = gastos.length > 0 ? gastos[0].total : 0;
  this.balancefn = this.presupuesto - this.gastosTotales;
};

// Hook para actualizar los gastos mensuales antes de guardar
BalanceSchema.pre('save', async function(next) {
  await this.updateGastosMensuales();
  next();
});

const Balance = mongoose.model('Balance', BalanceSchema);

module.exports = Balance;
