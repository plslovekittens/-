// ==================== КОРЗИНА С ОПЛАТОЙ ЧЕРЕЗ СБП ====================

// Получение корзины из localStorage
function getCart() {
    const cart = localStorage.getItem('volt_cart');
    return cart ? JSON.parse(cart) : [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
    localStorage.setItem('volt_cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

// Обновление счетчика товаров на иконке корзины
function updateCartCountDisplay() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ КОРЗИНЫ ====================

// Добавление товара в корзину
window.addToCart = function(productId) {
    console.log('addToCart вызван для товара:', productId);
    
    let product = null;
    if (window.allProducts && Array.isArray(window.allProducts)) {
        product = window.allProducts.find(p => p.id == productId);
    }
    
    if (!product) {
        console.error('Товар не найден:', productId);
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
            name: product.name || 'Без названия',
            price: product.price || 0,
            image: product.image || 'box',
            quantity: 1,
            sellerId: product.sellerId || null,
            sellerName: product.sellerName || 'Volt Official',
            key: product.key || 'Ключ будет отправлен после оплаты'
        });
    }
    
    saveCart(cart);
    displayCartItems();
    showNotification(`✅ ${product.name} добавлен в корзину`, 'success');
    
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }
};

// Удаление товара из корзины
window.removeFromCart = function(productId) {
    let cart = getCart();
    const removedItem = cart.find(item => item.id == productId);
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    displayCartItems();
    if (removedItem) {
        showNotification(`🗑️ ${removedItem.name} удалён из корзины`, 'info');
    }
};

// Обновление количества товара
window.updateCartQuantity = function(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id == productId);
    if (item) {
        const newQuantity = (item.quantity || 1) + change;
        if (newQuantity <= 0) {
            window.removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart(cart);
            displayCartItems();
        }
    }
};

// Очистка всей корзины
window.clearCart = function() {
    if (confirm('Очистить всю корзину?')) {
        saveCart([]);
        displayCartItems();
        showNotification('Корзина очищена', 'info');
    }
};

// ==================== ОТОБРАЖЕНИЕ КОРЗИНЫ ====================

function displayCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart" style="font-size: 48px; opacity: 0.5;"></i>
                <p>Корзина пуста</p>
                <small>Добавьте товары из каталога</small>
            </div>
        `;
        if (totalElement) totalElement.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let total = 0;
    
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        total += itemTotal;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="fas fa-${item.image || 'box'}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${escapeHtml(item.name)}</div>
                    <div class="cart-item-price">${(item.price || 0).toLocaleString()} ₽</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span class="qty-value">${item.quantity || 1}</span>
                        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    if (totalElement) totalElement.textContent = `${total.toLocaleString()} ₽`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ОПЛАТА ЧЕРЕЗ СБП С QR-КОДОМ ====================

// Показ модального окна с QR-кодом
window.showPaymentModal = function(cart, total) {
    const currentUser = window.getCurrentUser();
    
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
                    <div class="sbp-detail-row">
                        <span>Сумма к оплате:</span>
                        <strong id="sbpAmount">${total.toLocaleString()} ₽</strong>
                    </div>
                    <div class="sbp-detail-row">
                        <span>Номер заказа:</span>
                        <strong id="sbpOrderId">VOLT-${Date.now().toString().slice(-8)}</strong>
                    </div>
                    <div class="sbp-detail-row">
                        <span>Получатель:</span>
                        <strong>VOLT Store</strong>
                    </div>
                    <div class="sbp-detail-row">
                        <span>Покупатель:</span>
                        <strong>${currentUser ? escapeHtml(currentUser.name || currentUser.email) : 'Гость'}</strong>
                    </div>
                    <div class="sbp-detail-row">
                        <span>Статус:</span>
                        <strong style="color: #f59e0b;" id="sbpStatus">⏳ Ожидает оплаты</strong>
                    </div>
                </div>
                <div class="sbp-payment-info">
                    <i class="fas fa-info-circle"></i>
                    <span>Оплата происходит через Систему Быстрых Платежей (СБП). Деньги замораживаются до получения товара.</span>
                </div>
                <div class="sbp-actions">
                    <button class="btn btn-primary" id="confirmPaymentBtn" onclick="confirmPayment()">
                        <i class="fas fa-check-circle"></i> Я оплатил
                    </button>
                    <button class="btn btn-secondary" onclick="closePaymentModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем стили для модального окна
    if (!document.getElementById('sbpModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'sbpModalStyles';
        styles.textContent = `
            .sbp-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: sbpFadeIn 0.3s ease;
            }
            @keyframes sbpFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .sbp-modal-content {
                background: #1e293b;
                border-radius: 20px;
                max-width: 480px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: sbpSlideUp 0.3s ease;
            }
            @keyframes sbpSlideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .sbp-modal-header {
                padding: 20px;
                border-bottom: 1px solid #334155;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #0f172a;
                position: sticky;
                top: 0;
            }
            .sbp-modal-header h3 {
                margin: 0;
                color: white;
                font-size: 20px;
            }
            .sbp-modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 28px;
                cursor: pointer;
                transition: color 0.3s;
            }
            .sbp-modal-close:hover {
                color: #ef4444;
            }
            .sbp-modal-body {
                padding: 30px;
            }
            .sbp-qr-container {
                text-align: center;
                margin-bottom: 25px;
            }
            .sbp-qr-code {
                width: 200px;
                height: 200px;
                background: white;
                border-radius: 16px;
                margin: 0 auto 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
            }
            .sbp-qr-code img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .sbp-qr-hint {
                font-size: 12px;
                color: #94a3b8;
            }
            .sbp-payment-details {
                background: #0f172a;
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 15px;
            }
            .sbp-detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #334155;
            }
            .sbp-detail-row:last-child {
                border-bottom: none;
            }
            .sbp-detail-row span:first-child {
                color: #94a3b8;
            }
            .sbp-detail-row strong {
                color: white;
            }
            .sbp-payment-info {
                font-size: 12px;
                color: #94a3b8;
                text-align: center;
                padding: 12px;
                background: rgba(124,58,237,0.1);
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                gap: 8px;
                align-items: center;
                justify-content: center;
            }
            .sbp-payment-info i {
                color: #7c3aed;
                font-size: 16px;
            }
            .sbp-actions {
                display: flex;
                gap: 15px;
            }
            .sbp-actions .btn {
                flex: 1;
                padding: 12px;
                text-align: center;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
            }
            .sbp-actions .btn-primary {
                background: linear-gradient(135deg, #7c3aed 0%, #c084fc 100%);
                color: white;
            }
            .sbp-actions .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(124,58,237,0.4);
            }
            .sbp-actions .btn-primary:disabled {
                opacity: 0.6;
                transform: none;
            }
            .sbp-actions .btn-secondary {
                background: #334155;
                color: white;
            }
            .sbp-actions .btn-secondary:hover {
                background: #475569;
            }
            @media (max-width: 480px) {
                .sbp-modal-body {
                    padding: 20px;
                }
                .sbp-detail-row {
                    flex-direction: column;
                    gap: 5px;
                }
                .sbp-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Генерируем QR-код
    generateQRCode(total);
    
    // Сохраняем данные заказа для подтверждения
    window.pendingOrder = { cart, total };
};

// Генерация QR-кода
function generateQRCode(amount) {
    const qrContainer = document.getElementById('sbpQrCode');
    if (!qrContainer) return;
    
    const orderId = `VOLT-${Date.now().toString().slice(-8)}`;
    
    // Формируем строку для QR-кода (СБП)
    // В реальном проекте здесь будут реквизиты магазина
    const qrData = {
        sum: amount,
        order: orderId,
        recipient: "VOLT STORE",
        recipientAccount: "40817810099910004312", // Пример счета
        recipientBank: "СБП",
        purpose: "Оплата цифровых товаров"
    };
    
    const qrString = JSON.stringify(qrData);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrString)}`;
    
    qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR-код для оплаты" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Оплата%20заказа%20${orderId}'">`;
}

// Закрытие модального окна
window.closePaymentModal = function() {
    const modal = document.getElementById('sbpModal');
    if (modal) modal.remove();
    window.pendingOrder = null;
};

// Подтверждение оплаты
window.confirmPayment = async function() {
    if (!window.pendingOrder) return;
    
    const { cart, total } = window.pendingOrder;
    const currentUser = window.getCurrentUser();
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    const statusEl = document.getElementById('sbpStatus');
    
    if (!currentUser) {
        alert('Войдите в аккаунт для оформления заказа');
        closePaymentModal();
        window.location.href = 'login.html';
        return;
    }
    
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка оплаты...';
    }
    if (statusEl) {
        statusEl.innerHTML = '⏳ Проверка оплаты...';
        statusEl.style.color = '#f59e0b';
    }
    
    // Симуляция проверки оплаты (2 секунды)
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
            
            // Показываем сообщение с ключами
            let keysMessage = "✅ ОПЛАТА ПОДТВЕРЖДЕНА!\n\nВаши цифровые товары:\n\n";
            for (const item of cart) {
                keysMessage += `📦 ${item.name} x${item.quantity}\n🔑 Ключ: ${item.key || 'Будет отправлен на email'}\n\n`;
            }
            keysMessage += `\n💰 Сумма: ${total.toLocaleString()} ₽\n📧 Ключи отправлены на email: ${currentUser.email}`;
            
            alert(keysMessage);
            
            // Очищаем корзину
            localStorage.setItem('volt_cart', JSON.stringify([]));
            
            // Обновляем отображение корзины
            updateCartCountDisplay();
            displayCartItems();
            
            // Закрываем модальное окно
            closePaymentModal();
            
            // Показываем уведомление
            showNotification('Заказ успешно оформлен! Товары отправлены на email', 'success');
            
            // Закрываем корзину
            if (window.toggleCart) window.toggleCart();
            
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            if (statusEl) {
                statusEl.innerHTML = '❌ Ошибка оплаты';
                statusEl.style.color = '#ef4444';
            }
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Я оплатил';
            }
            showNotification('Ошибка при оформлении заказа: ' + error.message, 'error');
        }
    }, 2000);
};

// Оформление заказа (показываем QR-код)
window.checkout = function() {
    const cart = getCart();
    const currentUser = window.getCurrentUser();
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Войдите в аккаунт для оформления заказа', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    // Показываем модальное окно с QR-кодом
    window.showPaymentModal(cart, total);
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
        console.log(message);
    }
}

// Переключение видимости боковой панели корзины
window.toggleCart = function() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart.js инициализирован');
    updateCartCountDisplay();
    displayCartItems();
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'volt_cart') {
            updateCartCountDisplay();
            displayCartItems();
        }
    });
});
