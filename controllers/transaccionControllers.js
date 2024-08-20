const Transaccion = require('../models/transaccionModel');
const Notificacion = require('../models/notificacionModel');


exports.createTransaction = async (req, res) => {
  try {
    const { monto, fecha, usuario, grupo, gasto } = req.body;

    // Verifica si los campos son ObjectIds válidos
    if (!mongoose.Types.ObjectId.isValid(usuario) ||
        !mongoose.Types.ObjectId.isValid(grupo) ||
        !mongoose.Types.ObjectId.isValid(gasto)) {
      return res.status(400).json({ error: 'IDs de usuario, grupo o gasto no válidos' });
    }

    const nuevaTransaccion = new Transaccion({
      monto,
      fecha,
      usuario,
      grupo,
      gasto,
    });

    let transaccion = await nuevaTransaccion.save();

    // Asegúrate de que estás usando populate después de guardar la transacción
    transaccion = await Transaccion.findById(transaccion._id)
      .populate('usuario', 'nombre')  // Esto devuelve el nombre del usuario en lugar del ID
      .populate('grupo', 'nombre');   // Esto devuelve el nombre del grupo en lugar del ID

    res.status(201).json({ message: 'Transacción creada exitosamente', transaccion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transacciones = await Transaccion.find()
      .populate('usuario', 'nombre')
      .populate('grupo', 'nombre');
    res.status(200).json(transacciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id)
      .populate('usuario', 'nombre')
      .populate('grupo', 'nombre');
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.status(200).json(transaccion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    let transaccion = await Transaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });

    transaccion = await Transaccion.findById(transaccion._id)
      .populate('usuario', 'nombre')
      .populate('grupo', 'nombre');

    res.status(200).json({ message: 'Transacción actualizada exitosamente', transaccion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndDelete(req.params.id);
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.status(200).json({ message: 'Transacción eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pagarTransaccion = async (req, res) => {
  try {
    const transaccionId = req.params.id;

    // Encontrar la transacción
    const transaccion = await Transaccion.findById(transaccionId);
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });

    // Verificar que la transacción esté pendiente
    if (transaccion.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La transacción ya ha sido pagada o cancelada' });
    }

    // Actualizar el estado de la transacción a pagada
    transaccion.estado = 'pagada';
    await transaccion.save();

    // Crear una notificación para el usuario
    const mensaje = `Has pagado la transacción de ${transaccion.monto.toFixed(2)}.`;
    const notificacion = new Notificacion({ usuario: transaccion.usuario, mensaje });
    await notificacion.save();

    res.status(200).json({ message: 'Transacción pagada exitosamente', transaccion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('UserId:', userId); // Verifica el valor de userId
    const transactions = await Transaccion.find({ usuario: userId }); // Asegúrate de usar 'usuario' si ese es el campo en tu esquema
    console.log('Transactions:', transactions); // Verifica el valor de transactions

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ error: 'No transactions found' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
};