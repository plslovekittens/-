// ==================== КОРЗИНА ====================

// Получение корзины
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Сохранение корзины
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

// Обновление счетчика
function updateCartCountDisplay() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

// Добавление в корзину
window.addToCart = function(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity++;
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
    showNotification('Товар добавлен в корзину', 'success');
};

// Удаление из корзины
window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    displayCartItems();
    showNotification('Товар удален из корзины', 'success');
};

// Обновление количества
window.updateCartQuantity = function(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            displayCartItems();
        }
    }
};

// Отображение корзины
function displayCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Корзина пуста</p></div>';
        if (totalElement) totalElement.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let total = 0;
    
    for (let item of cart) {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div class="cart-item-image"><i class="fas fa-${item.image}"></i></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    if (totalElement) totalElement.textContent = `${total} ₽`;
}

// Переключение корзины
window.toggleCart = function() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
};

// Оформление заказа
window.checkout = function() {
    const cart = getCart();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Войдите в аккаунт для оформления заказа', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Создаем заказы
    for (let item of cart) {
        const order = {
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            buyerId: currentUser.id,
            buyerName: currentUser.name,
            sellerId: item.sellerId,
            sellerName: item.sellerName,
            productKey: item.key,
            status: 'paid',
            createdAt: new Date().toISOString()
        };
        
        if (window.db) {
            window.db.collection('orders').add(order);
        } else {
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }
    
    let keysMessage = "✅ ОПЛАТА ПОДТВЕРЖДЕНА!\n\nВаши цифровые товары:\n\n";
    for (let item of cart) {
        keysMessage += `📦 ${item.name} x${item.quantity}\n🔑 Ключ: ${item.key}\n\n`;
    }
    
    alert(keysMessage);
    
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCountDisplay();
    displayCartItems();
    toggleCart();
    showNotification('Заказ оформлен! Товары отправлены на email', 'success');
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateCartCountDisplay();
    displayCartItems();
});
