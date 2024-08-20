const Invitacion = require('../models/invitacionModel');
const Grupo = require('../models/grupoModel');
const Usuario = require('../models/usuarioModel');
const Notificacion = require('../models/notificacionModel');


exports.sendInvitation = async (req, res) => {
  try {
    const { email, grupoId } = req.body;

    // Buscar el grupo por ID
    const grupo = await Grupo.findById(grupoId);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });

    // Buscar al usuario por correo electrónico
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar si ya existe una invitación pendiente
    const invitacionExistente = await Invitacion.findOne({ usuario: usuario._id, grupo: grupoId });
    if (invitacionExistente) return res.status(400).json({ error: 'Ya existe una invitación pendiente para este usuario' });

    // Crear una nueva invitación
    const nuevaInvitacion = new Invitacion({ usuario: usuario._id, grupo: grupoId });
    const invitacion = await nuevaInvitacion.save();

    // Crear notificación para el usuario invitado
    const mensaje = `Has recibido una invitación para unirte al grupo "${grupo.nombre}".`;
    const notificacion = new Notificacion({ usuario: usuario._id, mensaje });
    await notificacion.save();

    res.status(201).json({ message: 'Invitación enviada exitosamente', invitacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvitationsByUser = async (req, res) => {
  try {
    const invitaciones = await Invitacion.find({ usuario: req.params.usuarioId }).populate('grupo');
    res.status(200).json(invitaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const invitacionId = req.params.id;
    const { estado } = req.body;

    const invitacion = await Invitacion.findById(invitacionId);
    if (!invitacion) return res.status(404).json({ error: 'Invitación no encontrada' });

    if (invitacion.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La invitación ya ha sido respondida' });
    }

    invitacion.estado = estado;
    invitacion.fechaRespuesta = new Date();
    await invitacion.save();

    // Si la invitación fue aceptada, agregar al usuario al grupo
    if (estado === 'aceptada') {
      const grupo = await Grupo.findById(invitacion.grupo);
      if (grupo) {
        grupo.integrantes.push(invitacion.usuario);
        await grupo.save();

        // Crear una notificación para el usuario que ha aceptado
        const mensaje = `Te has unido al grupo "${grupo.nombre}" exitosamente.`;
        const notificacion = new Notificacion({ usuario: invitacion.usuario, mensaje });
        await notificacion.save();
      }
    }

    res.status(200).json({ message: 'Respuesta a la invitación registrada exitosamente', invitacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getInvitationsByUser = async (req, res) => {
  try {
    const invitaciones = await Invitacion.find({ usuario: req.params.usuarioId }).populate('grupo');
    res.status(200).json(invitaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const invitacionId = req.params.id;
    const { estado } = req.body;

    // Buscar la invitación por ID
    const invitacion = await Invitacion.findById(invitacionId);
    if (!invitacion) {
      return res.status(404).json({ error: 'Invitación no encontrada' });
    }

    // Verificar que la invitación esté pendiente
    if (invitacion.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La invitación ya ha sido respondida' });
    }

    // Actualizar el estado de la invitación
    invitacion.estado = estado;
    invitacion.fechaRespuesta = new Date();
    await invitacion.save();

    // Si la invitación fue aceptada, agregar al usuario al grupo
    if (estado === 'aceptada') {
      const grupo = await Grupo.findById(invitacion.grupo);
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }

      // Verificar si el usuario ya es miembro del grupo
      const usuarioId = invitacion.usuario.toString();
      if (!grupo.integrantes.includes(usuarioId)) {
        grupo.integrantes.push(usuarioId);
        await grupo.save();

        // Crear una notificación para el usuario que ha aceptado
        const mensaje = `Te has unido al grupo "${grupo.nombre}" exitosamente.`;
        const notificacion = new Notificacion({ usuario: usuarioId, mensaje });
        await notificacion.save();
      } else {
        return res.status(400).json({ error: 'El usuario ya es miembro del grupo' });
      }
    }

    res.status(200).json({ message: 'Respuesta a la invitación registrada exitosamente', invitacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
