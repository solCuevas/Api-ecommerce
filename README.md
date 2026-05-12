# Backend I - Gestión de Productos y Carritos

Proyecto desarrollado  utilizando Node.js, Express, Handlebars, Socket.IO y MongoDB Atlas.

## Descripción

La aplicación permite gestionar productos y carritos mediante rutas API y vistas dinámicas. Además, se implementó actualización en tiempo real utilizando WebSockets con Socket.IO.

El proyecto fue desarrollado aplicando arquitectura básica de backend, manejo de rutas, renderizado de vistas y conexión a base de datos MongoDB Atlas.

---

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Handlebars
- Socket.IO
- JavaScript
- HTML/CSS

---

## Funcionalidades principales

### Productos
- Listado de productos
- Creación de productos
- Eliminación de productos
- Actualización en tiempo real con WebSockets

### Carritos
- Creación de carritos
- Gestión de productos dentro del carrito

### Vistas dinámicas
- Home con listado de productos
- Vista en tiempo real (`/realtimeproducts`)

### Base de datos
- Conexión a MongoDB Atlas mediante Mongoose

---

## WebSockets

Se utilizó Socket.IO para:
- Detectar conexiones de clientes
- Agregar productos en tiempo real
- Eliminar productos en tiempo real
- Actualizar automáticamente las vistas conectadas

---

## Estructura del proyecto

```bash
src/
 ├── managers/
 ├── routes/
 ├── views/
 ├── public/
 ├── server.js
