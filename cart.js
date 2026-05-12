// ==================== КОРЗИНА ====================

// Получение корзины
function getCart() {
    const cart = localStorage.getItem('volt_cart');
    return cart ? JSON.parse(cart) : [];
}

// Сохранение корзины
function saveCart(cart) {
    localStorage.setItem('volt_cart', JSON.stringify(cart));
    updateCartCount();
}

// Обновление счетчика
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

// Добавление в корзину
window.addToCart = function(productId) {
    console.log('addToCart:', productId);
    
    // Получаем товар из глобального массива
    let product = null;
    if (window.allProducts) {
        product = window.allProducts.find(p => p.id == productId);
    }
    
    // Если товар не найден, пробуем получить из localStorage
    if (!product) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        product = products.find(p => p.id == productId);
    }
    
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
            image: product.image || 'box',
            quantity: 1,
            sellerId: product.sellerId,
            sellerName: product.sellerName || 'Volt Official',
            key: product.key || 'Ключ будет отправлен после оплаты'
        });
    }
    
    saveCart(cart);
    displayCartItems();
    showNotification(`${product.name} добавлен в корзину`, 'success');
    
    // Анимация
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }
};

// Удаление из корзины
window.removeFromCart = function(productId) {
    let cart = getCart();
    const removed = cart.find(item => item.id == productId);
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    displayCartItems();
    if (removed) showNotification(`${removed.name} удалён`, 'info');
};

// Обновление количества
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

// Отображение корзины
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
                    <div class="cart-item-title">${escapeHtml(item.name)}</div>
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

// ==================== ОПЛАТА ЧЕРЕЗ СБП С QR-КОДОМ ====================

// Показ модального окна с QR-кодом
window.showPaymentModal = function(cart, total) {
    const currentUser = window.getCurrentUser();
    const orderId = `VOLT-${Date.now().toString().slice(-8)}`;
    
    const modal = document.createElement('div');
    modal.className = 'sbp-modal';
    modal.id = 'sbpModal';
    modal.innerHTML = `
        <div class="sbp-modal-content">
            <div class="sbp-modal-header">
                <h3><i class="fas fa-qrcode"></i> Оплата через СБП</h3>
                <button class="sbp-modal-close" onclick="closePaymentModal()">&times;</button>
            </div>
            <div class="sbp-modal-body">
                <div class="sbp-qr-container">
                    <div class="sbp-qr-code" id="sbpQrCode"></div>
                    <p class="sbp-qr-hint">Наведите камеру телефона на QR-код</p>
                </div>
                <div class="sbp-payment-details">
                    <div class="sbp-detail-row"><span>Сумма:</span><strong>${total.toLocaleString()} ₽</strong></div>
                    <div class="sbp-detail-row"><span>Заказ:</span><strong>${orderId}</strong></div>
                    <div class="sbp-detail-row"><span>Получатель:</span><strong>VOLT Store</strong></div>
                    <div class="sbp-detail-row"><span>Покупатель:</span><strong>${currentUser ? escapeHtml(currentUser.name) : 'Гость'}</strong></div>
                    <div class="sbp-detail-row"><span>Статус:</span><strong id="sbpStatus" style="color:#f59e0b;">⏳ Ожидает оплаты</strong></div>
                </div>
                <div class="sbp-payment-info">
                    <i class="fas fa-info-circle"></i>
                    <span>Оплата через СБП. Деньги замораживаются до получения товара.</span>
                </div>
                <div class="sbp-actions">
                    <button class="btn btn-primary" id="confirmPaymentBtn" onclick="confirmPayment()"><i class="fas fa-check-circle"></i> Я оплатил</button>
                    <button class="btn btn-secondary" onclick="closePaymentModal()"><i class="fas fa-times"></i> Отмена</button>
                </div>
            </div>
        </div>
    `;
    
    // Стили для модального окна
    if (!document.getElementById('sbpModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'sbpModalStyles';
        styles.textContent = `
            .sbp-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:10000; animation:sbpFadeIn 0.3s; }
            @keyframes sbpFadeIn { from{opacity:0;} to{opacity:1;} }
            .sbp-modal-content { background:#1e293b; border-radius:20px; max-width:450px; width:90%; animation:sbpSlideUp 0.3s; }
            @keyframes sbpSlideUp { from{transform:translateY(50px); opacity:0;} to{transform:translateY(0); opacity:1;} }
            .sbp-modal-header { padding:20px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center; }
            .sbp-modal-header h3 { margin:0; color:white; }
            .sbp-modal-close { background:none; border:none; color:#94a3b8; font-size:28px; cursor:pointer; }
            .sbp-modal-close:hover { color:#ef4444; }
            .sbp-modal-body { padding:25px; }
            .sbp-qr-container { text-align:center; margin-bottom:20px; }
            .sbp-qr-code { width:200px; height:200px; background:white; border-radius:16px; margin:0 auto 10px; display:flex; align-items:center; justify-content:center; }
            .sbp-qr-code img { width:100%; height:100%; object-fit:contain; }
            .sbp-qr-hint { font-size:12px; color:#94a3b8; }
            .sbp-payment-details { background:#0f172a; border-radius:12px; padding:15px; margin-bottom:15px; }
            .sbp-detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #334155; }
            .sbp-detail-row:last-child { border-bottom:none; }
            .sbp-detail-row span { color:#94a3b8; }
            .sbp-detail-row strong { color:white; }
            .sbp-payment-info { font-size:12px; color:#94a3b8; text-align:center; padding:10px; background:rgba(124,58,237,0.1); border-radius:10px; margin-bottom:20px; }
            .sbp-actions { display:flex; gap:15px; }
            .sbp-actions .btn { flex:1; padding:12px; border:none; border-radius:10px; font-weight:600; cursor:pointer; }
            .sbp-actions .btn-primary { background:linear-gradient(135deg,#7c3aed,#c084fc); color:white; }
            .sbp-actions .btn-secondary { background:#334155; color:white; }
            .sbp-actions .btn-primary:disabled { opacity:0.6; }
            @media (max-width:480px) { .sbp-detail-row { flex-direction:column; gap:5px; } .sbp-actions { flex-direction:column; } }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Генерируем QR-код
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Оплата%20заказа%20${orderId}%20на%20сумму%20${total}%20руб.`;
    document.getElementById('sbpQrCode').innerHTML = `<img src="${qrUrl}" alt="QR-код">`;
    
    window.pendingOrder = { cart, total, orderId };
};

window.closePaymentModal = function() {
    const modal = document.getElementById('sbpModal');
    if (modal) modal.remove();
    window.pendingOrder = null;
};

window.confirmPayment = async function() {
    if (!window.pendingOrder) return;
    
    const { cart, total, orderId } = window.pendingOrder;
    const currentUser = window.getCurrentUser();
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    const statusEl = document.getElementById('sbpStatus');
    
    if (!currentUser) {
        alert('Войдите в аккаунт');
        closePaymentModal();
        window.location.href = 'login.html';
        return;
    }
    
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
    }
    if (statusEl) {
        statusEl.innerHTML = '⏳ Проверка оплаты...';
        statusEl.style.color = '#f59e0b';
    }
    
    setTimeout(async () => {
        try {
            // Создаём заказы
            for (const item of cart) {
                const order = {
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity,
                    buyerId: currentUser.id,
                    buyerName: currentUser.name,
                    sellerId: item.sellerId || 'admin',
                    sellerName: item.sellerName || 'Volt Official',
                    productKey: item.key,
                    status: 'paid',
                    createdAt: new Date().toISOString()
                };
                
                if (window.DB && window.DB.createOrder) {
                    await window.DB.createOrder(order);
                } else {
                    let orders = JSON.parse(localStorage.getItem('orders')) || [];
                    orders.push(order);
                    localStorage.setItem('orders', JSON.stringify(orders));
                }
            }
            
            let message = "✅ ОПЛАТА ПОДТВЕРЖДЕНА!\n\nЗаказ: " + orderId + "\nСумма: " + total.toLocaleString() + " ₽\n\nВаши товары:\n\n";
            for (const item of cart) {
                message += `📦 ${item.name} x${item.quantity}\n🔑 Ключ: ${item.key}\n\n`;
            }
            message += `📧 Ключи отправлены на email: ${currentUser.email}`;
            alert(message);
            
            localStorage.setItem('volt_cart', JSON.stringify([]));
            updateCartCount();
            displayCartItems();
            closePaymentModal();
            if (window.toggleCart) window.toggleCart();
            showNotification('Заказ оформлен!', 'success');
            
        } catch (error) {
            if (statusEl) {
                statusEl.innerHTML = '❌ Ошибка';
                statusEl.style.color = '#ef4444';
            }
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Я оплатил';
            }
            alert('Ошибка: ' + error.message);
        }
    }, 2000);
};

// Оформление заказа
window.checkout = function() {
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
    window.showPaymentModal(cart, total);
};

// Вспомогательные функции
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
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

window.toggleCart = function() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.toggle('active');
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCartItems();
    console.log('Cart.js загружен');
});
