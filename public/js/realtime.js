const socket = io();

const form = document.getElementById('addProductForm');
const productList = document.getElementById('productList');

form.addEventListener('submit', (e) => {
e.preventDefault();
const productData = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value),
    category: form.category.value,
    thumbnails: form.thumbnails.value ? [form.thumbnails.value] : []
};
socket.emit('newProduct', productData);
form.reset();
});

socket.on('updateProducts', (products) => {
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
<strong>${product.title}</strong> - $${product.price} - ${product.category}
<button onclick="deleteProduct(${product.id})">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});

window.deleteProduct = (id) => {
  socket.emit('deleteProduct', id);
};
