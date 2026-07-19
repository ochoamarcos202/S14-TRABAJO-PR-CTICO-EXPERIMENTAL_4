# Proyecto Unidad 4 — Gestión de Biblioteca

API REST + Frontend React para gestión de biblioteca con Express, MongoDB, JWT y OAuth (Google).

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express + Mongoose |
| Frontend | React + Vite + React Router |
| Base de datos | MongoDB |
| Autenticación | JWT + bcrypt + Passport (Google OAuth) |

---

## Requisitos

- Node.js >= 18
- MongoDB corriendo localmente (puerto 27017)

---

## Instalación

### 1. Clonar e instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Variables de entorno

#### Backend (`backend/.env`)

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/unidad4
JWT_SECRET=una-clave-segura-aqui
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173
SESSION_SECRET=una-clave-de-sesion-segura
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
ADMIN_NOMBRE=Administrador Biblioteca
ADMIN_EMAIL=admin@biblioteca.com
ADMIN_PASSWORD=admin123
```

> Copia `backend/.env.example` como `backend/.env` y completa los valores.

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

> Copia `frontend/.env.example` como `frontend/.env`.

### 3. Poblar base de datos

```bash
# Crear administrador
cd backend
npm run seed:admin

# Agregar catalogo de libros
npm run seed:libros
```

Administrador por defecto:

```
Email:    admin@biblioteca.com
Password: admin123
```

---

## Ejecución

### Backend (puerto 3000)

```bash
cd backend
npm run dev
```

### Frontend (puerto 5173)

```bash
cd frontend
npm run dev
```

Abrir `http://localhost:5173`.

---

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | — | Iniciar sesión (JWT) |
| GET | `/auth/me` | Token | Datos del usuario autenticado |
| GET | `/auth/google` | — | Login con Google |
| GET | `/auth/google/callback` | — | Callback OAuth Google |
| POST | `/usuarios` | — | Registrar usuario |
| GET | `/usuarios` | Admin | Listar usuarios |
| GET | `/libros` | Token | Catálogo de libros |
| POST | `/libros` | Admin | Crear libro |
| PUT | `/libros/:id` | Admin | Actualizar libro |
| DELETE | `/libros/:id` | Admin | Eliminar libro |
| POST | `/solicitudes` | Token | Solicitar préstamo o proponer libro |
| GET | `/solicitudes` | Token | Listar solicitudes (propias o todas si admin) |
| PATCH | `/solicitudes/:id/revisar` | Admin | Aprobar o rechazar solicitud |
| PATCH | `/solicitudes/:id/devolver` | Token | Devolver libro prestado |

---

## Scripts disponibles

```bash
npm run seed:admin     # Crear o actualizar usuario administrador
npm run seed:libros    # Poblar catalogo con 15 libros de ejemplo
npm run dev            # Iniciar servidor en modo desarrollo
npm start              # Iniciar servidor en modo produccion
```

---

## OAuth con Google

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Habilita la API de Google OAuth
3. Agrega como URI de redirección autorizada: `http://localhost:3000/auth/google/callback`
4. Copia `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` al `.env` del backend
