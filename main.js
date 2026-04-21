// ==================== ОСНОВНОЙ ФУНКЦИОНАЛ ====================

let allProducts = [];

// Загрузка товаров
async function loadProducts() {
    const result = await window.DB.getAllProducts();
    
    if (result.success && result.data.length > 0) {
        allProducts = result.data;
        displayProducts(allProducts);
        displayCategories();
    } else {
        // Запасные товары если Firestore пуст
        allProducts = getFallbackProducts();
        displayProducts(allProducts);
        displayCategories();
        
        // Добавляем запасные товары в Firestore при первом запуске
        for (const product of allProducts) {
            await window.DB.addProduct(product);
        }
    }
}

// Запасные товары
function getFallbackProducts() {
    return [
        { name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "CYBER-2077-KEY", description: "Открытый мир RPG" },
        { name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "BG3-KEY", description: "Легендарная RPG" },
        { name: "Microsoft Office 2024", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "OFFICE-KEY", description: "Офисный пакет" },
        { name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "DISCORD-KEY", description: "Подписка Discord" }
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
                <h3 class="product-title">${product.name}</h3>
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

// ==================== ПОИСК ====================
window.toggleSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
            document.getElementById('searchInput').focus();
        }
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
    
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.slice(0, 8).map(p => `
        <div class="search-result-item" onclick="selectProduct('${p.id}')">
            <i class="fas fa-${p.image || 'box'}"></i>
            <div>
                <div>${p.name}</div>
                <small>${p.price} ₽</small>
            </div>
        </div>
    `).join('');
};

window.selectProduct = function(productId) {
    closeSearch();
    const product = allProducts.find(p => p.id == productId);
    if (product) {
        showNotification(`Товар "${product.name}" найден!`, 'success');
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }
};

// ==================== КОРЗИНА ====================
window.getCart = function() {
    const cart = localStorage.getItem('volt_cart');
    return cart ? JSON.parse(cart) : [];
};

window.saveCart = function(cart) {
    localStorage.setItem('volt_cart', JSON.stringify(cart));
    updateCartCount();
};

function updateCartCount() {
    const cart = window.getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

window.addToCart = function(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) {
        showNotification('Товар не найден', 'error');
        return;
    }
    
    let cart = window.getCart();
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            key: product.key,
            sellerId: product.sellerId,
            sellerName: product.sellerName
        });
    }
    
    window.saveCart(cart);
    displayCartItems();
    showNotification(`${product.name} добавлен в корзину`, 'success');
    
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }
};

window.removeFromCart = function(productId) {
    let cart = window.getCart();
    cart = cart.filter(item => item.id != productId);
    window.saveCart(cart);
    displayCartItems();
    showNotification('Товар удалён из корзины', 'info');
};

window.updateCartQuantity = function(productId, change) {
    let cart = window.getCart();
    const item = cart.find(item => item.id == productId);
    if (item) {
        const newQty = (item.quantity || 1) + change;
        if (newQty <= 0) {
            window.removeFromCart(productId);
        } else {
            item.quantity = newQty;
            window.saveCart(cart);
            displayCartItems();
        }
    }
};

function displayCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    const cart = window.getCart();
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
        if (totalElement) totalElement.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let total = 0;
    
    for (let item of cart) {
        const qty = item.quantity || 1;
        total += (item.price || 0) * qty;
        html += `
            <div class="cart-item">
                <div class="cart-item-image"><i class="fas fa-${item.image || 'box'}"></i></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${(item.price || 0).toLocaleString()} ₽</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span>${qty}</span>
                        <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    if (totalElement) totalElement.textContent = `${total.toLocaleString()} ₽`;
}

window.toggleCart = function() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.toggle('active');
};

// Оформление заказа с использованием DB
window.checkout = async function() {
    const cart = window.getCart();
    const currentUser = window.getCurrentUser();
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Войдите в аккаунт', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    // Создаём заказы в Firestore
    let allSuccess = true;
    for (let item of cart) {
        const orderResult = await window.DB.createOrder({
            buyerId: currentUser.id,
            buyerName: currentUser.name,
            sellerId: item.sellerId || 'admin',
            sellerName: item.sellerName || 'Volt Official',
            productId: item.id,
            productName: item.name,
            quantity: item.quantity || 1,
            price: item.price,
            total: (item.price || 0) * (item.quantity || 1),
            productKey: item.key || 'Ключ будет отправлен на email'
        });
        
        if (!orderResult.success) {
            allSuccess = false;
            console.error('Ошибка создания заказа:', orderResult.error);
        }
    }
    
    if (allSuccess) {
        let message = "✅ ЗАКАЗ ОФОРМЛЕН!\n\nВаши товары:\n\n";
        for (let item of cart) {
            message += `📦 ${item.name} x${item.quantity || 1} - ${((item.price || 0) * (item.quantity || 1)).toLocaleString()} ₽\n`;
        }
        message += `\n💰 Итого: ${total.toLocaleString()} ₽\n📧 Товары отправлены на email: ${currentUser.email}`;
        
        alert(message);
        
        localStorage.setItem('volt_cart', JSON.stringify([]));
        updateCartCount();
        displayCartItems();
        window.toggleCart();
        showNotification('Заказ оформлен!', 'success');
    } else {
        showNotification('Ошибка при оформлении заказа', 'error');
    }
};

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
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

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    
    const checkFirebase = setInterval(() => {
        if (window.db && window.DB) {
            clearInterval(checkFirebase);
            console.log('Firebase и DB готовы, загружаем товары...');
            loadProducts();
            updateCartCount();
            displayCartItems();
            window.updateUserInterface();
        }
    }, 500);
});
