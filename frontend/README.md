# Frontend Unidad 4 - Biblioteca

Interfaz React para login, registro y gestion de biblioteca.

## Ejecucion local

```cmd
npm install
copy .env.example .env
npm run dev
```

El frontend usa `http://localhost:3000` por defecto. Puedes cambiarlo con `VITE_API_URL`.

## Roles

- `usuario`: puede iniciar sesion y consultar el catalogo de libros.
- `admin`: puede crear, editar y eliminar libros.

Cuenta admin local por defecto:

```txt
Email: admin@biblioteca.com
Contrasena: admin123
```
