// ==================== ОСНОВНОЙ ФУНКЦИОНАЛ ====================

let allProducts = [];

async function loadProducts() {
    const result = await window.DB.getAllProducts();
    if (result.success && result.data.length > 0) {
        allProducts = result.data;
        displayProducts(allProducts);
        displayCategories();
    } else {
        allProducts = [];
        displayProducts([]);
        displayCategories();
    }
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

window.filterProducts = function(category) {
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    displayProducts(filtered);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category));
    });
};

function getBadgeText(badge) {
    const badges = { 'popular': 'Популярное', 'new': 'Новинка', 'sale': 'Скидка' };
    return badges[badge] || badge;
}

function getCategoryName(category) {
    const names = { 'games': 'Игры', 'software': 'Программы', 'subscriptions': 'Подписки' };
    return names[category] || category;
}

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

// Корзина
function getCart() {
    const cart = localStorage.getItem('volt_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('volt_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
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
    
    let cart = getCart();
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
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            key: product.key
        });
    }
    
    saveCart(cart);
    displayCartItems();
    showNotification(`${product.name} добавлен в корзину`, 'success');
};

window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    displayCartItems();
    showNotification('Товар удалён', 'info');
};

function displayCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    const cart = getCart();
    
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

window.updateCartQuantity = function(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id == productId);
    if (item) {
        const newQty = (item.quantity || 1) + change;
        if (newQty <= 0) {
            window.removeFromCart(productId);
        } else {
            item.quantity = newQty;
            saveCart(cart);
            displayCartItems();
        }
    }
};

window.toggleCart = function() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.toggle('active');
};

window.checkout = async function() {
    const cart = getCart();
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
    
    for (let item of cart) {
        await window.DB.createOrder({
            buyerId: currentUser.id,
            buyerName: currentUser.name,
            sellerId: item.sellerId || 'admin',
            sellerName: item.sellerName || 'Volt Official',
            productId: item.id,
            productName: item.name,
            quantity: item.quantity || 1,
            price: item.price,
            total: (item.price || 0) * (item.quantity || 1),
            productKey: item.key
        });
    }
    
    alert('✅ Заказ оформлен! Товары отправлены на email.');
    localStorage.setItem('volt_cart', JSON.stringify([]));
    updateCartCount();
    displayCartItems();
    window.toggleCart();
};

document.addEventListener('DOMContentLoaded', function() {
    const checkFirebase = setInterval(() => {
        if (window.db && window.DB) {
            clearInterval(checkFirebase);
            loadProducts();
            updateCartCount();
            displayCartItems();
            window.updateUserInterface();
        }
    }, 500);
});
