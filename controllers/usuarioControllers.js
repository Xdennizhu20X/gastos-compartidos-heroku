const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // Verificar si el email ya está en uso
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }

    // Cifrar la contraseña
    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasena: contrasenaCifrada,  // Almacenar la contraseña cifrada
    });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario creado exitosamente', nuevoUsuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Encriptar la nueva contraseña si se proporciona
    if (contrasena) {
      usuario.contrasena = await bcrypt.hash(contrasena, 10);
    }

    // Actualizar los detalles del usuario
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    await usuario.save();
    res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
