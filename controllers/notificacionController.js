const Notificacion = require('../models/notificacionModel');
const Usuario = require('../models/usuarioModel');

// Crear una nueva notificación
exports.createNotification = async (req, res) => {
  try {
    const { usuarioId, mensaje } = req.body;

    // Verificar que el usuario exista
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Crear la notificación
    const nuevaNotificacion = new Notificacion({ usuario: usuarioId, mensaje });
    await nuevaNotificacion.save();

    res.status(201).json({ message: 'Notificación creada exitosamente', nuevaNotificacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las notificaciones para un usuario
exports.getNotificationsByUser = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    // Obtener las notificaciones del usuario
    const notificaciones = await Notificacion.find({ usuario: usuarioId });
    res.status(200).json(notificaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Marcar una notificación como leída
exports.markAsRead = async (req, res) => {
  try {
    const notificacionId = req.params.id;

    // Encontrar la notificación y marcarla como leída
    const notificacion = await Notificacion.findById(notificacionId);
    if (!notificacion) return res.status(404).json({ error: 'Notificación no encontrada' });

    notificacion.leido = true;
    await notificacion.save();

    res.status(200).json({ message: 'Notificación marcada como leída', notificacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una notificación
exports.deleteNotification = async (req, res) => {
  try {
    const notificacionId = req.params.id;

    const notificacion = await Notificacion.findByIdAndDelete(notificacionId);
    if (!notificacion) return res.status(404).json({ error: 'Notificación no encontrada' });

    res.status(200).json({ message: 'Notificación eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
