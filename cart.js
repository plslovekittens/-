// ==================== КОРЗИНА ====================

function getCart() {
    const cart = localStorage.getItem('volt_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('volt_cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

function updateCartCountDisplay() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

window.addToCart = function(productId) {
    const product = window.allProducts ? window.allProducts.find(p => p.id == productId) : null;
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
    
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }
};

window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    displayCartItems();
    showNotification('Товар удалён из корзины', 'info');
};

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

window.toggleCart = function() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.toggle('active');
};

// Оформление заказа с сохранением в коллекцию orders
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
    
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    // Создаём заказы в коллекции orders
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
        updateCartCountDisplay();
        displayCartItems();
        window.toggleCart();
        showNotification('Заказ оформлен!', 'success');
    } else {
        showNotification('Ошибка при оформлении заказа', 'error');
    }
};

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

document.addEventListener('DOMContentLoaded', function() {
    updateCartCountDisplay();
    displayCartItems();
});
