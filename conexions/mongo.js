const mongoose = require('mongoose');
require('dotenv').config(); // Asegúrate de tener dotenv instalado para usar variables de entorno

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gastos_compartidos'; // Usa la variable de entorno o la URI local por defecto

mongoose.connect(dbURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('¡Conexión a la base de datos establecida correctamente!');
});
