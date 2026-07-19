require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDatabase = require('../src/config/db');
const Usuario = require('../src/models/Usuario');

async function crearAdmin() {
  await connectDatabase();

  const nombre = process.env.ADMIN_NOMBRE || 'Administrador Biblioteca';
  const email = (process.env.ADMIN_EMAIL || 'admin@biblioteca.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  await Usuario.findOneAndUpdate(
    { email },
    { nombre, email, password: passwordHash, rol: 'admin' },
    { upsert: true, runValidators: true, new: true }
  );

  console.log(`Administrador listo: ${email}`);
  process.exit(0);
}

crearAdmin().catch((error) => {
  console.error(`No se pudo crear el administrador: ${error.message}`);
  process.exit(1);
});
