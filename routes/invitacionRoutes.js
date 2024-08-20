const express = require('express');
const router = express.Router();
const {
  sendInvitation,
  getInvitationsByUser,
  respondToInvitation
} = require('../controllers/invitacionController');

// Ruta para enviar una invitación
router.post('/invitacion', sendInvitation);

// Ruta para obtener invitaciones de un usuario
router.post('/invitacion/:usuarioId', getInvitationsByUser);

// Ruta para responder a una invitación
router.post('/invitacion/:id/responder', respondToInvitation);

module.exports = router;
