import fs from 'fs/promises';

export default class CartManager {
  constructor(path = './carts.json') {
    this.path = path;
    this.carts = [];
  }

  async load() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch {
      this.carts = [];
      await this.save();
    }
  }

  async save() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    await this.load();
    const newId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    this.carts.push(newCart);
    await this.save();
    return newCart;
  }

  async getCartById(id) {
    await this.load();
    return this.carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    await this.load();
    const cart = this.carts.find(c => c.id === cartId);
    if (!cart) return false;

    const prodInCart = cart.products.find(p => p.product === productId);
    if (prodInCart) {
      prodInCart.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.save();
    return true;
  }
}