document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('single-product');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        productContainer.innerHTML = '<p>Продуктът не е намерен. <a href="catalog.html">Върнете се в каталога</a>.</p>';
        return;
    }

    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === parseInt(productId));

            if (product) {
                productContainer.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h1>${product.name}</h1>
                        <div class="category-tag">Категория: ${product.category}</div>
                        <div class="price">${product.price.toFixed(2)} €</div>
                        <p class="desc">${product.description}</p>
                        <a href="order.html" class="btn" style="text-align: center; width: 200px;">Поръчай сега</a>
                    </div>
                `;
            } else {
                productContainer.innerHTML = '<p>Продуктът не е намерен. <a href="catalog.html">Върнете се в каталога</a>.</p>';
            }
        })
        .catch(error => {
            console.error("Грешка:", error);
            productContainer.innerHTML = '<p>Възникна грешка при зареждането на продукта.</p>';
        });
});