let allProducts = [];

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    allProducts = products;
    displayProducts(allProducts);
    displayCategories();
}

function displayCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    const categories = [
        { id: "games", name: "Игры", icon: "gamepad", count: allProducts.filter(p => p.category === 'games').length },
        { id: "software", name: "Программы", icon: "laptop-code", count: allProducts.filter(p => p.category === 'software').length },
        { id: "subscriptions", name: "Подписки", icon: "crown", count: allProducts.filter(p => p.category === 'subscriptions').length }
    ];
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterProducts('${cat.id}')">
            <i class="fas fa-${cat.icon}"></i>
            <h3>${cat.name}</h3>
            <span>${cat.count}+ товаров</span>
        </div>
    `).join('');
}

function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (productsToShow.length === 0) {
        grid.innerHTML = '<div class="no-products">Товары не найдены</div>';
        return;
    }
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.imageData ? 
                    `<img src="${product.imageData}" style="width:100%; height:100%; object-fit:cover;">` : 
                    `<i class="fas fa-${product.image || 'box'}"></i>`
                }
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart('${product.id}')">В корзину</button>
                <div class="seller-info">Продавец: ${product.sellerName || 'Volt Official'}</div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    displayProducts(filtered);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category));
    });
}

function getCategoryName(category) {
    const names = { 'games': 'Игры', 'software': 'Программы', 'subscriptions': 'Подписки' };
    return names[category] || category;
}

// Загрузка при старте
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCountDisplay();
    displayCartItems();
});
