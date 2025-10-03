import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import mongoose from 'mongoose';

// Routers y managers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './managers/ProductManager.js';

// Soporte para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instancias
const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);
const productManager = new ProductManager();

// Handlebars config con helpers para paginación
app.engine('handlebars', engine({
  helpers: {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Vista estática - home
app.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.render('home', { products });
});

// Vista en tiempo real - websocket
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getAll();
  res.render('realTimeProducts', { products });
});

// WebSocket handlers
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket');

  socket.on('newProduct', async (productData) => {
    await productManager.addProduct(productData);
    const updatedProducts = await productManager.getAll();
    io.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getAll();
    io.emit('updateProducts', updatedProducts);
  });
});

// 🔹 Conexión a MongoDB Atlas directamente en server.js
mongoose.connect('mongodb+srv://cuevassol_db_user:Jp4P1oYkRrA2mEbI@cluster0.zdagbjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar con MongoDB:', err));

// Iniciar servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});