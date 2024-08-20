const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoControllers');

// Crear un nuevo grupo
router.post('/grupos', grupoController.createGroup);

// Obtener todos los grupos (usando POST en lugar de GET)
router.post('/grupos/all', grupoController.getAllGroups);

// Obtener un grupo por su ID (usando POST en lugar de GET)
router.post('/grupos/:id', grupoController.getGroupById);

// Actualizar un grupo por su ID
router.post('/grupos/update/:id', grupoController.updateGroup);

// Eliminar un grupo por su ID
router.post('/grupos/delete/:id', grupoController.deleteGroup);

router.post('/grupos/usuario/:userId', grupoController.getGroupsByUserId);


module.exports = router;
