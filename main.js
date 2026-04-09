// ==================== ОСНОВНОЙ ФУНКЦИОНАЛ ====================

document.addEventListener('DOMContentLoaded', function() {
    displayCategories();
    displayProducts(getAllProducts());
    updateUserInterface();
    updateCartCountDisplay();
    displayCartItems();
});

// Отображение категорий
function displayCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    const categories = [
        { id: "games", name: "Игры", icon: "gamepad", count: 150 },
        { id: "software", name: "Программы", icon: "laptop-code", count: 80 },
        { id: "subscriptions", name: "Подписки", icon: "crown", count: 45 }
    ];
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterProducts('${cat.id}')">
            <i class="fas fa-${cat.icon}"></i>
            <h3>${cat.name}</h3>
            <span>${cat.count}+ товаров</span>
        </div>
    `).join('');
}

// Отображение товаров
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
                <i class="fas fa-${product.image || 'box'}"></i>
                ${product.badge ? `<span class="product-badge ${product.badge}">${getBadgeText(product.badge)}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating || 4.5)}</div>
                    <span class="reviews">(${product.reviews || 0})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                    <button class="wishlist-btn" onclick="showNotification('Добавлено в избранное', 'success')">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="seller-info">Продавец: ${product.sellerName || 'Volt Official'}</div>
            </div>
        </div>
    `).join('');
}

// Фильтрация товаров
function filterProducts(category) {
    const products = getAllProducts();
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    displayProducts(filtered);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category));
    });
}

// Поиск
function toggleSearch() {
    document.getElementById('searchOverlay').classList.toggle('active');
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    const products = getAllProducts();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query))
    );
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.slice(0, 5).map(p => `
        <div class="search-result-item" onclick="selectProduct(${p.id})">
            <i class="fas fa-${p.image || 'box'}"></i>
            <div>
                <div>${p.name}</div>
                <small>${getCategoryName(p.category)} • ${p.price} ₽</small>
            </div>
        </div>
    `).join('');
}

function selectProduct(productId) {
    closeSearch();
    const product = getAllProducts().find(p => p.id == productId);
    if (product) {
        alert(`${product.name}\nЦена: ${product.price} ₽\nПродавец: ${product.sellerName || 'Volt Official'}`);
    }
}

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } else {
        alert(message);
    }
}

// Вспомогательные функции
function getBadgeText(badge) {
    const badges = { 'popular': 'Популярное', 'new': 'Новинка', 'sale': 'Скидка' };
    return badges[badge] || badge;
}

function getCategoryName(category) {
    const names = { 'games': 'Игры', 'software': 'Программы', 'subscriptions': 'Подписки' };
    return names[category] || category;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}
