require('dotenv').config();
const connectDatabase = require('../src/config/db');
const Libro = require('../src/models/Libro');

const libros = [
  { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', categoria: 'Novela', anio: 1967, stock: 5 },
  { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', categoria: 'Clásico', anio: 1605, stock: 3 },
  { titulo: '1984', autor: 'George Orwell', categoria: 'Distopía', anio: 1949, stock: 4 },
  { titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', categoria: 'Infantil', anio: 1943, stock: 6 },
  { titulo: 'Harry Potter y la piedra filosofal', autor: 'J.K. Rowling', categoria: 'Fantasía', anio: 1997, stock: 7 },
  { titulo: 'El señor de los anillos', autor: 'J.R.R. Tolkien', categoria: 'Fantasía', anio: 1954, stock: 3 },
  { titulo: 'Orgullo y prejuicio', autor: 'Jane Austen', categoria: 'Romance', anio: 1813, stock: 2 },
  { titulo: 'Crimen y castigo', autor: 'Fiador Dostoyevski', categoria: 'Clásico', anio: 1866, stock: 4 },
  { titulo: 'La casa de los espíritus', autor: 'Isabel Allende', categoria: 'Novela', anio: 1982, stock: 3 },
  { titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', categoria: 'Distopía', anio: 1953, stock: 5 },
  { titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', categoria: 'Fantasía', anio: 2007, stock: 4 },
  { titulo: 'Matar a un ruiseñor', autor: 'Harper Lee', categoria: 'Novela', anio: 1960, stock: 3 },
  { titulo: 'Drácula', autor: 'Bram Stoker', categoria: 'Terror', anio: 1897, stock: 2 },
  { titulo: 'El Código Da Vinci', autor: 'Dan Brown', categoria: 'Suspenso', anio: 2003, stock: 6 },
  { titulo: 'Los juegos del hambre', autor: 'Suzanne Collins', categoria: 'Distopía', anio: 2008, stock: 5 },
];

async function seed() {
  await connectDatabase();

  const existentes = await Libro.countDocuments();
  if (existentes > 0) {
    console.log(`Ya hay ${existentes} libros en el catalogo. Ejecuta con FORCE=true para reemplazarlos.`);
    process.exit(0);
  }

  const creados = await Libro.insertMany(libros);
  console.log(`${creados.length} libros agregados al catalogo.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
