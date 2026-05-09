// ==================== ОСНОВНОЙ ФУНКЦИОНАЛ ====================

window.allProducts = [];

// Загрузка товаров из Firestore
async function loadProducts() {
    console.log("🔄 Загрузка товаров из Firestore...");
    
    if (!window.db) {
        console.error("❌ Firestore не инициализирован!");
        return;
    }
    
    try {
        // Загружаем ВСЕ активные товары
        const snapshot = await window.db.collection('products').where('isActive', '==', true).get();
        console.log("📦 Получено документов из Firestore:", snapshot.size);
        
        window.allProducts = [];
        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            window.allProducts.push(product);
            console.log("📦 Товар:", product.name, "Категория:", product.category);
        });
        
        console.log("✅ Загружено товаров:", window.allProducts.length);
        
        // Если товаров нет - показываем сообщение
        if (window.allProducts.length === 0) {
            console.log("⚠️ Товары не найдены в Firestore. Добавьте товары через панель продавца.");
            document.getElementById('productsGrid').innerHTML = '<div class="no-products">Товары не найдены. Добавьте товары через панель продавца.</div>';
        }
        
        displayProducts(window.allProducts);
        displayCategories();
        updateStats();
        
    } catch (error) {
        console.error("❌ Ошибка загрузки товаров:", error);
        window.allProducts = [];
        displayProducts([]);
        displayCategories();
    }
}

// Обновление статистики
function updateStats() {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) productsCount.textContent = window.allProducts.length;
}

// Отображение категорий
function displayCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    const categories = [
        { id: "games", name: "Игры", icon: "gamepad", count: window.allProducts.filter(p => p.category === 'games').length },
        { id: "software", name: "Программы", icon: "laptop-code", count: window.allProducts.filter(p => p.category === 'software').length },
        { id: "subscriptions", name: "Подписки", icon: "crown", count: window.allProducts.filter(p => p.category === 'subscriptions').length }
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
        grid.innerHTML = '<div class="no-products">Товары не найдены. <a href="login.html" style="color: #7c3aed;">Войдите как продавец</a> чтобы добавить товары.</div>';
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.imageData ? 
                    `<img src="${product.imageData}" style="width:100%; height:100%; object-fit:cover;">` : 
                    `<i class="fas fa-${product.image || 'box'}"></i>`
                }
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

// Фильтрация
window.filterProducts = function(category) {
    const filtered = category === 'all' ? window.allProducts : window.allProducts.filter(p => p.category === category);
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
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const results = document.getElementById('searchResults');
    
    if (!results) return;
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    const filtered = window.allProducts.filter(p => p.name.toLowerCase().includes(query));
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.slice(0, 5).map(p => `
        <div class="search-result-item" onclick="selectProduct('${p.id}')">
            ${p.imageData ? 
                `<img src="${p.imageData}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;">` : 
                `<i class="fas fa-${p.image || 'box'}"></i>`
            }
            <div><div>${escapeHtml(p.name)}</div><small>${p.price} ₽</small></div>
        </div>
    `).join('');
};

window.selectProduct = function(productId) {
    closeSearch();
    const product = window.allProducts.find(p => p.id == productId);
    if (product) {
        alert(`${product.name}\nЦена: ${product.price} ₽`);
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

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM загружен, ожидаем Firebase...");
    
    const checkFirebase = setInterval(() => {
        if (window.db && window.DB) {
            clearInterval(checkFirebase);
            console.log("✅ Firebase готов, загружаем товары...");
            loadProducts();
            if (window.updateCartCountDisplay) window.updateCartCountDisplay();
            if (window.displayCartItems) window.displayCartItems();
            window.updateUserInterface();
        } else {
            console.log("⏳ Ожидание Firebase...");
        }
    }, 500);
});
