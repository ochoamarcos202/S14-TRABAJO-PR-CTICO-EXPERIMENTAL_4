const mongoose = require('mongoose');

async function connectDatabase() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI no está configurada');
  }

  await mongoose.connect(MONGO_URI);
  console.log('MongoDB conectado');
}

module.exports = connectDatabase;
