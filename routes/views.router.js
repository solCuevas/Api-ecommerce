import { Router } from 'express';
import { ProductModel } from '../models/Product.model.js';
import { CartModel } from '../models/Cart.model.js';

const router = Router();

// Vista home con productos paginados
router.get('/products', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const filter = query ? { category: query } : {};
        const sortOptions = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const totalProducts = await ProductModel.countDocuments(filter);
        const products = await ProductModel.find(filter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(totalProducts / limit);

        res.render('products', {
            products,
            pagination: { totalPages, page, hasPrevPage: page > 1, hasNextPage: page < totalPages }
        });
    } catch (error) {
        res.status(500).send("Error cargando productos");
    }
});

// Vista detalle producto
router.get('/products/:pid', async (req, res) => {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render('productDetail', { product });
});

// Vista carrito
router.get('/carts/:cid', async (req, res) => {
    const cart = await CartModel.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render('cart', { cart });
});

export default router;