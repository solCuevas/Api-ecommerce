import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';

// Routers y managers 
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './managers/ProductManager.js';

// Soporte para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instancias
const app = express();
const httpServer = createServer(app);       // HTTP server
const io = new SocketIO(httpServer);        // WebSocket server
const productManager = new ProductManager(); // Manejo de productos

// Handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(express.json());
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
    io.emit('updateProducts', updatedProducts); // Envia a todos los conectados
});

socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getAll();
    io.emit('updateProducts', updatedProducts);
});
});

// Iniciar servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
