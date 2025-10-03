import { Router } from 'express';
import { CartModel } from '../models/Cart.model.js';

const router = Router();

router.post('/', async (req, res) => {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === req.params.pid);
    if (existing) existing.quantity++;
    else cart.products.push({ product: req.params.pid, quantity: 1 });

    await cart.save();
    res.json(cart);
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    res.json(cart);
});

router.put('/:cid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = req.body.products || [];
    await cart.save();
    res.json(cart);
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = cart.products.find(p => p.product.toString() === req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado en carrito" });

    product.quantity = req.body.quantity || product.quantity;
    await cart.save();
    res.json(cart);
});

router.delete('/:cid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();
    res.json(cart);
});

export default router;
