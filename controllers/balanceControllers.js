const Balance = require('../models/balanceModel');
const Grupo = require('../models/grupoModel');

// Crear un nuevo balance o actualizar uno existente
exports.createOrUpdateBalance = async (req, res) => {
  try {
    const { grupo, mes } = req.body;

    // Asegúrate de que el grupo exista
    const grupoDoc = await Grupo.findById(grupo);
    if (!grupoDoc) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    // Buscar o crear el balance
    let balance = await Balance.findOne({ grupo, mes });
    if (!balance) {
      balance = new Balance({ grupo, mes });
    }

    await balance.save();
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los balances (con posibilidad de filtrar por grupo)
exports.getAllBalances = async (req, res) => {
  try {
    const { grupo } = req.body; // Asegúrate de enviar 'grupo' en el cuerpo de la solicitud
    const query = grupo ? { grupo } : {};
    const balances = await Balance.find(query);
    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un balance específico por ID
exports.getBalanceById = async (req, res) => {
  try {
    const { id } = req.body; // Cambiado a req.body para que sea consistente con el uso de POST
    const balance = await Balance.findById(id);
    if (!balance) {
      return res.status(404).json({ message: 'Balance no encontrado' });
    }
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un balance existente
exports.updateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { grupo, mes } = req.body;

    const balance = await Balance.findById(id);
    if (!balance) {
      return res.status(404).json({ message: 'Balance no encontrado' });
    }

    // Actualiza los campos del balance
    balance.grupo = grupo || balance.grupo;
    balance.mes = mes || balance.mes;

    await balance.save();
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un balance por ID
exports.deleteBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await Balance.findByIdAndDelete(id);
    if (!balance) {
      return res.status(404).json({ message: 'Balance no encontrado' });
    }
    res.status(200).json({ message: 'Balance eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
