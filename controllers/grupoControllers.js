const Grupo = require('../models/grupoModel');
const Usuario = require('../models/usuarioModel');

exports.createGroup = async (req, res) => {
  try {
    const { nombre, integrantes } = req.body;

    // Verifica si todos los usuarios existen
    const usuarios = await Usuario.find({ '_id': { $in: integrantes } });
    if (usuarios.length !== integrantes.length) {
      return res.status(404).json({ error: 'Algunos usuarios no fueron encontrados' });
    }

    const nuevoGrupo = new Grupo({ nombre, integrantes });
    const grupo = await nuevoGrupo.save();
    res.status(201).json({ message: 'Grupo creado exitosamente', grupo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const grupos = await Grupo.find().populate('integrantes', 'nombre');
    res.status(200).json(grupos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const grupo = await Grupo.findById(req.params.id).populate('integrantes', 'nombre');
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
    res.status(200).json(grupo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { nombre, descripcion, integrantes, presupuesto } = req.body;

    // Verifica que todos los integrantes existan en la base de datos
    const usuarios = await Usuario.find({ _id: { $in: integrantes } });
    if (usuarios.length !== integrantes.length) {
      return res.status(400).json({ error: 'Algunos usuarios no existen' });
    }

    // Verifica que el presupuesto sea un número positivo
    if (presupuesto !== undefined && (typeof presupuesto !== 'number' || presupuesto <= 0)) {
      return res.status(400).json({ error: 'Presupuesto inválido' });
    }

    // Encuentra el grupo y actualiza solo los campos proporcionados
    const grupo = await Grupo.findById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }

    if (nombre) grupo.nombre = nombre;
    if (descripcion) grupo.descripcion = descripcion;
    if (integrantes) grupo.integrantes = integrantes;
    if (presupuesto) grupo.presupuesto = presupuesto;

    // Guarda el grupo actualizado
    await grupo.save();

    // Devuelve el grupo actualizado con los detalles de los integrantes
    const grupoActualizado = await Grupo.findById(grupo._id).populate('integrantes', 'nombre');
    
    res.status(200).json({ message: 'Grupo actualizado exitosamente', grupo: grupoActualizado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteGroup = async (req, res) => {
  try {
    const grupo = await Grupo.findByIdAndDelete(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
    res.status(200).json({ message: 'Grupo eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('UserId:', userId); // Verifica el valor de userId

    // Encuentra todos los grupos donde el usuario es integrante
    const grupos = await Grupo.find({ integrantes: userId }).populate('integrantes', 'nombre');
    console.log('Grupos:', grupos); // Verifica el valor de grupos

    if (!grupos || grupos.length === 0) {
      return res.status(404).json({ error: 'No groups found' });
    }

    res.status(200).json(grupos);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: error.message });
  }
};