import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager();

router.get('/', async (req, res) => {
  const products = await pm.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await pm.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || newProduct.status === undefined || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  // thumbnails es opcional, si no viene, poner []
  if (!newProduct.thumbnails) newProduct.thumbnails = [];
  await pm.addProduct(newProduct);
  res.status(201).json({ message: 'Producto agregado' });
});

router.put('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const data = req.body;
  delete data.id; // evitar cambio de id
  const updated = await pm.updateProduct(pid, data);
  if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ message: 'Producto actualizado' });
});

router.delete('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  await pm.deleteProduct(pid);
  res.json({ message: 'Producto eliminado' });
});

export default router;