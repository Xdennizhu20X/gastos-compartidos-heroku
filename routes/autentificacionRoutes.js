var express = require('express');
var router = express.Router();
const autentificacionController = require('../controllers/autentificacionControllers');
const User = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Ruta para el registro de usuario
router.post('/aut/register', autentificacionController.register);

// Ruta para el inicio de sesión de usuario
router.post('/aut/login', async (req, res) => {
    const { email, contrasena } = req.body;

    // Aquí deberías buscar al usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ message: 'Usuario no encontrado' });
  
    // Verificar la contraseña (esto es solo un ejemplo)
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) return res.status(401).send({ message: 'Credenciales inválidas' });
  
    // Generar un token (esto es solo un ejemplo)
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
  
    res.send({ token, userId: user._id });
  });
  

module.exports = router;
