
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let productsData = [];

    
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            productsData = data;
            displayProducts(productsData); 
        })
        .catch(error => {
            console.error("Грешка при зареждане на продуктите:", error);
            productList.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Има проблем със зареждането на продуктите. <em>(Забележка: Ако отваряш файла директно през браузъра без сървър, браузърът може да блокира JSON файла поради мерки за сигурност. Препоръчва се ползването на Live Server във VS Code)</em>.</p>';
        });

    
    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            
            card.classList.add('card', 'fade-in', 'visible');
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toFixed(2)} €</p>
                    <a href="product.html?id=${product.id}" class="btn">Детайли</a>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            
            filterBtns.forEach(b => b.classList.remove('active'));
            
            e.target.classList.add('active');

            const category = e.target.getAttribute('data-filter');
            
            
            if (category === 'всички') {
                displayProducts(productsData);
            } else {
                const filtered = productsData.filter(p => p.category === category);
                displayProducts(filtered);
            }
        });
    });
});