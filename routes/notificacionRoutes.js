const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  deleteNotification
} = require('../controllers/notificacionController');

// Ruta para crear una nueva notificación
router.post('/notificacion', createNotification);

// Ruta para obtener todas las notificaciones de un usuario
router.post('/notificacion/:usuarioId', getNotificationsByUser);

// Ruta para marcar una notificación como leída
router.post('/notificacion/:id/leido', markAsRead);

// Ruta para eliminar una notificación
router.post('/notificacion/delete/:id', deleteNotification);

module.exports = router;
