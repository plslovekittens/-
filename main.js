// ==================== ОСНОВНОЙ ФУНКЦИОНАЛ ====================

let allProducts = [];

// Ждем загрузки Firebase
function waitForFirebaseAndLoad() {
    if (window.db) {
        loadProducts();
    } else {
        setTimeout(waitForFirebaseAndLoad, 100);
    }
}

// Загрузка товаров из Firestore
async function loadProducts() {
    try {
        const snapshot = await window.db.collection('products').get();
        allProducts = [];
        snapshot.forEach(doc => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });
        
        if (allProducts.length === 0) {
            await initializeProducts();
        } else {
            displayProducts(allProducts);
            displayCategories();
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        // Запасные товары
        allProducts = getFallbackProducts();
        displayProducts(allProducts);
        displayCategories();
    }
    
    updateCartCountDisplay();
    displayCartItems();
}

// Запасные товары
function getFallbackProducts() {
    return [
        { id: 1, name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale", sellerName: "Volt Official" },
        { id: 2, name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new", sellerName: "Volt Official" },
        { id: 3, name: "Microsoft Office 2024", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular", sellerName: "Volt Official" },
        { id: 4, name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular", sellerName: "Volt Official" }
    ];
}

// Инициализация товаров
async function initializeProducts() {
    const defaultProducts = [
        { name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "CYBER-2077-KEY", rating: 4.5, reviews: 1250 },
        { name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "BG3-KEY", rating: 5.0, reviews: 8760 },
        { name: "Red Dead Redemption 2", category: "games", price: 2290, oldPrice: 3990, discount: 42, image: "horse", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "RDR2-KEY", rating: 4.9, reviews: 15600 },
        { name: "Microsoft Office 2024", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "OFFICE-KEY", rating: 4.8, reviews: 3420 },
        { name: "Adobe Photoshop 2024", category: "software", price: 2990, oldPrice: 5990, discount: 50, image: "paint-brush", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "PS-KEY", rating: 4.8, reviews: 2300 },
        { name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "DISCORD-KEY", rating: 4.9, reviews: 5600 },
        { name: "Telegram Premium", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "telegram", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "TG-KEY", rating: 4.7, reviews: 8900 },
        { name: "The Witcher 3", category: "games", price: 1490, oldPrice: 2990, discount: 50, image: "hat-wizard", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "WITCHER-KEY", rating: 4.9, reviews: 23400 }
    ];
    
    for (const product of defaultProducts) {
        await window.db.collection('products').add({
            ...product,
            createdAt: new Date().toISOString(),
            soldCount: 0
        });
    }
    
    loadProducts();
}

// Отображение категорий
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
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">
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

// Фильтрация
window.filterProducts = function(category) {
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    displayProducts(filtered);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category));
    });
};

// Поиск
window.toggleSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.toggle('active');
};

window.closeSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.remove('active');
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const results = document.getElementById('searchResults');
    if (results) results.innerHTML = '';
};

window.searchProducts = function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.slice(0, 5).map(p => `
        <div class="search-result-item" onclick="selectProduct('${p.id}')">
            <i class="fas fa-${p.image || 'box'}"></i>
            <div><div>${p.name}</div><small>${p.price} ₽</small></div>
        </div>
    `).join('');
};

window.selectProduct = function(productId) {
    closeSearch();
    const product = allProducts.find(p => p.id == productId);
    if (product) {
        alert(`${product.name}\nЦена: ${product.price} ₽\nПродавец: ${product.sellerName || 'Volt Official'}`);
    }
};

// Уведомления
window.showNotification = function(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    } else {
        alert(message);
    }
};

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

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    waitForFirebaseAndLoad();
    updateUserInterface();
});
