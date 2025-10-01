import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cm = new CartManager();

router.post('/', async (req, res) => {
  const newCart = await cm.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cid = Number(req.params.cid);
  const cart = await cm.getCartById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);

  const added = await cm.addProductToCart(cid, pid);
  if (!added) return res.status(404).json({ error: 'Carrito no encontrado' });

  res.json({ message: 'Producto agregado al carrito' });
});

export default router;