import { Router } from 'express';
import { ProductModel } from '../models/Product.model.js';

const router = Router();

router.get('/', async (req, res) => {
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

        res.json({
            status: "success",
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", error });
    }
});

router.get('/:pid', async (req, res) => {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    const created = await ProductModel.create(newProduct);
    res.status(201).json(created);
});

router.put('/:pid', async (req, res) => {
    const updated = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
});

router.delete('/:pid', async (req, res) => {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
});

export default router;
