# Backend Unidad 4 - Biblioteca

API REST para una gestion de biblioteca con MongoDB, Express y autenticacion JWT.

## Configuracion

1. Copia `.env.example` como `.env` y completa `MONGO_URI` y `JWT_SECRET`.
2. Instala dependencias con `npm install`.
3. Crea o actualiza el administrador con `npm run seed:admin`.
4. Ejecuta `npm run dev` para desarrollo o `npm start` para produccion.

## Administrador local

Por defecto el script crea:

```txt
Email: admin@biblioteca.com
Contrasena: admin123
```

Puedes cambiarlo con `ADMIN_NOMBRE`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`.

## Endpoints

- `GET /health`
- `POST /usuarios` publico para registrar usuarios normales
- `POST /auth/login`
- `GET /libros` y `GET /libros/:id` requieren token JWT
- `POST /libros`, `PUT /libros/:id` y `DELETE /libros/:id` requieren token JWT con rol `admin`
- `GET /solicitudes` lista solicitudes; admin ve todas y usuario ve las suyas
- `POST /solicitudes` permite al usuario pedir un libro o proponer uno nuevo
- `PATCH /solicitudes/:id/revisar` permite al admin aprobar o rechazar una solicitud
- `GET /usuarios`, `GET /usuarios/:id`, `PUT /usuarios/:id`, `DELETE /usuarios/:id` requieren rol `admin`
- `GET /auth/google` y `GET /auth/google/callback` requieren configurar variables `GOOGLE_*`

## OAuth con Google

En Google Cloud Console registra como URI de redireccion:

```txt
http://localhost:3000/auth/google/callback
```

Despues completa `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` y `SESSION_SECRET` en `.env`.
