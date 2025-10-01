import fs from 'fs/promises';

export default class ProductManager {
  constructor(path = './products.json') {
    this.path = path;
    this.products = [];
  }

  async load() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch {
      this.products = [];
      await this.save();
    }
  }

  async save() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async getAll() {
    await this.load();
    return this.products;
  }

  async getById(id) {
    await this.load();
    return this.products.find(p => p.id === id);
  }

  async addProduct(product) {
    await this.load();
    const newId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    product.id = newId;
    this.products.push(product);
    await this.save();
  }

  async updateProduct(id, data) {
    await this.load();
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products[index] = { ...this.products[index], ...data, id: this.products[index].id };
    await this.save();
    return true;
  }

  async deleteProduct(id) {
    await this.load();
    this.products = this.products.filter(p => p.id !== id);
    await this.save();
  }
}