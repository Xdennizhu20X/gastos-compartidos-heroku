const Gasto = require('../models/gastoModel');
const Transaccion = require('../models/transaccionModel');
const Grupo = require('../models/grupoModel');
const Notificacion = require('../models/notificacionModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Usuario = require('../models/usuarioModel')

exports.createExpense = async (req, res) => {
  try {
    const { nombre, precio, grupo, fechaVencimiento } = req.body;
    const usuarioCreador = req.userId || req.body.usuarioCreador;

    if (!usuarioCreador) {
      return res.status(400).json({ error: 'ID de usuario no encontrado' });
    }

    console.log('ID de usuario recibido:', usuarioCreador);
    console.log('Cuerpo de la solicitud:', req.body)  ;

    if (!mongoose.Types.ObjectId.isValid(usuarioCreador)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const usuario = await Usuario.findById(usuarioCreador);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!nombre || !precio || !grupo || !fechaVencimiento) {
      return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    if (!mongoose.Types.ObjectId.isValid(grupo)) {
      return res.status(400).json({ error: 'ID de grupo inválido' });
    }

    const grupoEncontrado = await Grupo.findById(grupo).populate('integrantes');
    if (!grupoEncontrado) return res.status(404).json({ error: 'Grupo no encontrado' });

    const nuevoGasto = new Gasto({
      nombre,
      precio,
      grupoId: grupo,  // Usa grupoId si es el nombre correcto en el esquema
      fechaVencimiento,
      usuarioCreador
    });

    await nuevoGasto.save();

    const montoPorUsuario = precio / grupoEncontrado.integrantes.length;

    for (let usuario of grupoEncontrado.integrantes) {
      if (!usuario || !usuario._id) {
        console.error(`Usuario no válido: ${usuario}`);
        continue;
      }

      const nuevaTransaccion = new Transaccion({
        monto: montoPorUsuario,
        fecha: new Date(),
        usuario: usuario._id,
        grupo: grupoEncontrado._id,
        gasto: nuevoGasto._id,
        estado: 'pendiente',
      });
      await nuevaTransaccion.save();

      const mensaje = `Se ha registrado un nuevo gasto "${nombre}" en tu grupo. Debes pagar ${montoPorUsuario.toFixed(2)} antes del ${new Date(fechaVencimiento).toLocaleDateString()}.`;
      const notificacion = new Notificacion({
        usuario: usuario._id,
        mensaje,
      });
      await notificacion.save();
    }

    res.status(201).json({ message: 'Gasto creado y dividido exitosamente' });
  } catch (err) {
    console.error('Error creando el gasto:', err.message);
    res.status(500).json({ error: err.message });
  }
};


// Obtener todos los gastos
exports.getAllExpenses = async (req, res) => {
  try {
    const gastos = await Gasto.find().populate('grupoId');
    res.status(200).json(gastos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un gasto por ID
exports.getExpenseById = async (req, res) => {
  try {
    const gasto = await Gasto.findById(req.params.id).populate('grupo');
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.status(200).json(gasto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un gasto
exports.updateExpense = async (req, res) => {
  try {
    const { nombre, precio, grupo } = req.body;

    // Verificar que el grupo exista
    const grupoExistente = await Grupo.findById(grupo);
    if (!grupoExistente) {
      return res.status(400).json({ error: 'Grupo no encontrado' });
    }

    const gasto = await Gasto.findByIdAndUpdate(req.params.id, { nombre, precio, grupo }, { new: true }).populate('grupo');
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.status(200).json({ message: 'Gasto actualizado exitosamente', gasto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un gasto
exports.deleteExpense = async (req, res) => {
  try {
    const gasto = await Gasto.findByIdAndDelete(req.params.id);
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.status(200).json({ message: 'Gasto eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpensesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Buscar todas las transacciones asociadas al usuario
    const transacciones = await Transaccion.find({ usuario: userId }).populate({
      path: 'gasto',
      populate: { path: 'grupoId', select: 'nombre' }, // Popula el grupo asociado al gasto
    });

    if (!transacciones || transacciones.length === 0) {
      return res.status(404).json({ error: 'No se encontraron gastos para este usuario' });
    }

    // Obtener todos los gastos asociados a las transacciones
    const gastos = transacciones.map(transaccion => transaccion.gasto);

    res.status(200).json(gastos);
  } catch (err) {
    console.error('Error al obtener los gastos por ID de usuario:', err.message);
    res.status(500).json({ error: err.message });
  }
};