// ==================== ОСНОВНОЙ ФУНКЦИОНАЛ ====================

let allProducts = [];

// Загрузка товаров
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
            updateStats();
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        allProducts = getFallbackProducts();
        displayProducts(allProducts);
        displayCategories();
        updateStats();
    }
}

// Обновление статистики на главной странице
function updateStats() {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) productsCount.textContent = allProducts.length;
}

// Запасные товары
function getFallbackProducts() {
    return [
        { id: "1", name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale", sellerName: "Volt Official", key: "CYBER-2077-KEY" },
        { id: "2", name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new", sellerName: "Volt Official", key: "BG3-KEY" },
        { id: "3", name: "Microsoft Office 2024", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular", sellerName: "Volt Official", key: "OFFICE-KEY" },
        { id: "4", name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular", sellerName: "Volt Official", key: "DISCORD-KEY" }
    ];
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
                <h3 class="product-title">${escapeHtml(product.name)}</h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                </div>
                <div class="seller-info">Продавец: ${escapeHtml(product.sellerName || 'Volt Official')}</div>
            </div>
        </div>
    `).join('');
}

// Функция экранирования HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Фильтрация
window.filterProducts = function(category) {
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    displayProducts(filtered);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category));
    });
};

// ==================== ПОИСК (ИСПРАВЛЕН) ====================

window.toggleSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.toggle('active');
    if (overlay && overlay.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
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
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const results = document.getElementById('searchResults');
    
    if (!results) return;
    
    if (query.length === 0) {
        results.innerHTML = '';
        return;
    }
    
    if (query.length < 2) {
        results.innerHTML = '<div class="search-info">Введите минимум 2 символа</div>';
        return;
    }
    
    // Ищем в allProducts (глобальная переменная из main.js)
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.category && getCategoryName(p.category).toLowerCase().includes(query))
    );
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.slice(0, 8).map(p => `
        <div class="search-result-item" onclick="selectProductAndClose('${p.id}')">
            <i class="fas fa-${p.image || 'box'}"></i>
            <div class="search-result-info">
                <div class="search-result-name">${escapeHtml(p.name)}</div>
                <div class="search-result-price">${p.price} ₽</div>
                <div class="search-result-category">${getCategoryName(p.category)}</div>
            </div>
        </div>
    `).join('');
};

window.selectProductAndClose = function(productId) {
    closeSearch();
    const product = allProducts.find(p => p.id == productId);
    if (product) {
        // Прокручиваем к товарам и показываем уведомление
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        showNotification(`Товар "${product.name}" найден!`, 'success');
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

// Уведомления
window.showNotification = function(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    } else {
        console.log(message);
    }
};

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    if (window.db) {
        loadProducts();
    } else {
        setTimeout(() => loadProducts(), 500);
    }
    updateUserInterface();
});
