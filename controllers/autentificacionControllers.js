const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // Validación básica
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ message: 'Faltan datos en la solicitud' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Cifrar la contraseña antes de guardar
    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    // Crear y guardar el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasena: contrasenaCifrada,
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

// Iniciar sesión de un usuario
exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Validación básica
    if (!email || !contrasena) {
      return res.status(400).json({ message: 'Faltan datos en la solicitud' });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) { 
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña cifrada
    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un token JWT
    const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login exitoso' });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
