// ==================== КОРЗИНА ====================

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

// Добавление товара в корзину (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
window.addToCart = function(productId) {
    console.log('addToCart вызван для товара:', productId);
    
    // Получаем товар из глобального массива allProducts
    let product = null;
    if (window.allProducts && Array.isArray(window.allProducts)) {
        product = window.allProducts.find(p => p.id == productId);
    }
    
    // Если товар не найден в allProducts, пробуем получить из Firestore напрямую
    if (!product && window.db) {
        window.db.collection('products').doc(productId).get().then(doc => {
            if (doc.exists) {
                product = { id: doc.id, ...doc.data() };
                addToCartInternal(product);
            } else {
                console.error('Товар не найден:', productId);
                showNotification('Товар не найден', 'error');
            }
        }).catch(err => {
            console.error('Ошибка получения товара:', err);
            showNotification('Ошибка при добавлении товара', 'error');
        });
        return;
    }
    
    if (!product) {
        console.error('Товар не найден в allProducts:', productId);
        showNotification('Товар не найден', 'error');
        return;
    }
    
    addToCartInternal(product);
};

// Внутренняя функция добавления товара
function addToCartInternal(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id == product.id);
    
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
    
    // Анимация кнопки корзины
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

// Удаление товара из корзины (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
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

// Обновление количества товара (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
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

// Очистка всей корзины (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
window.clearCart = function() {
    if (confirm('Очистить всю корзину?')) {
        saveCart([]);
        displayCartItems();
        showNotification('Корзина очищена', 'info');
    }
};

// ==================== ОТОБРАЖЕНИЕ КОРЗИНЫ ====================

// Отображение товаров в корзине
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

// Вспомогательная функция для экранирования HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ОФОРМЛЕНИЕ ЗАКАЗА ====================

// Оформление заказа (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
window.checkout = async function() {
    const cart = getCart();
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Войдите в аккаунт для оформления заказа', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    // Показываем модальное окно с подтверждением оплаты
    showPaymentModal(cart, total, currentUser);
};

// Показ модального окна оплаты
function showPaymentModal(cart, total, currentUser) {
    // Создаём модальное окно
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.id = 'paymentModal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3><i class="fas fa-qrcode"></i> Оплата через СБП</h3>
                <button class="payment-modal-close" onclick="closePaymentModal()">&times;</button>
            </div>
            <div class="payment-modal-body">
                <div class="payment-qr-container">
                    <div class="payment-qr">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="payment-details">
                        <div class="payment-row">
                            <span>Сумма к оплате:</span>
                            <strong>${total.toLocaleString()} ₽</strong>
                        </div>
                        <div class="payment-row">
                            <span>Номер заказа:</span>
                            <strong>VOLT-${Date.now().toString().slice(-8)}</strong>
                        </div>
                        <div class="payment-row">
                            <span>Получатель:</span>
                            <strong>VOLT Store</strong>
                        </div>
                        <div class="payment-row">
                            <span>Статус:</span>
                            <strong style="color: #f59e0b;">Ожидает оплаты</strong>
                        </div>
                    </div>
                    <div class="payment-info">
                        <i class="fas fa-info-circle"></i>
                        Наведите камеру телефона на QR-код или оплатите по реквизитам
                    </div>
                </div>
                <div class="payment-actions">
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
    if (!document.getElementById('paymentModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'paymentModalStyles';
        styles.textContent = `
            .payment-modal {
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
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .payment-modal-content {
                background: #1e293b;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .payment-modal-header {
                padding: 20px;
                border-bottom: 1px solid #334155;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #0f172a;
            }
            .payment-modal-header h3 {
                margin: 0;
                color: white;
            }
            .payment-modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 24px;
                cursor: pointer;
                transition: color 0.3s;
            }
            .payment-modal-close:hover {
                color: #ef4444;
            }
            .payment-modal-body {
                padding: 30px;
            }
            .payment-qr-container {
                text-align: center;
                margin-bottom: 25px;
            }
            .payment-qr {
                width: 180px;
                height: 180px;
                background: white;
                border-radius: 20px;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .payment-qr i {
                font-size: 120px;
                color: #7c3aed;
            }
            .payment-details {
                background: #0f172a;
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 15px;
            }
            .payment-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #334155;
            }
            .payment-row:last-child {
                border-bottom: none;
            }
            .payment-row span:first-child {
                color: #94a3b8;
            }
            .payment-row strong {
                color: white;
            }
            .payment-info {
                font-size: 12px;
                color: #94a3b8;
                text-align: center;
                padding: 10px;
                background: rgba(124,58,237,0.1);
                border-radius: 8px;
            }
            .payment-actions {
                display: flex;
                gap: 15px;
                margin-top: 20px;
            }
            .payment-actions .btn {
                flex: 1;
                padding: 12px;
                text-align: center;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            .payment-actions .btn-primary {
                background: linear-gradient(135deg, #7c3aed 0%, #c084fc 100%);
                color: white;
            }
            .payment-actions .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(124,58,237,0.4);
            }
            .payment-actions .btn-secondary {
                background: #334155;
                color: white;
            }
            .payment-actions .btn-secondary:hover {
                background: #475569;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Сохраняем данные заказа для подтверждения
    window.pendingOrder = { cart, total, currentUser };
}

// Закрытие модального окна оплаты
window.closePaymentModal = function() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.remove();
    window.pendingOrder = null;
};

// Подтверждение оплаты
window.confirmPayment = async function() {
    if (!window.pendingOrder) return;
    
    const { cart, total, currentUser } = window.pendingOrder;
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка оплаты...';
    }
    
    // Симуляция проверки оплаты
    setTimeout(async () => {
        try {
            // Создаём заказы в Firestore
            for (const item of cart) {
                const order = {
                    buyerId: currentUser.id,
                    buyerName: currentUser.name,
                    sellerId: item.sellerId || 'admin',
                    sellerName: item.sellerName || 'Volt Official',
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity || 1,
                    price: item.price,
                    total: (item.price || 0) * (item.quantity || 1),
                    productKey: item.key || 'Ключ будет отправлен на email',
                    status: 'paid',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                if (window.db) {
                    await window.db.collection('orders').add(order);
                } else {
                    // Fallback на localStorage
                    let orders = JSON.parse(localStorage.getItem('volt_orders')) || [];
                    orders.push(order);
                    localStorage.setItem('volt_orders', JSON.stringify(orders));
                }
            }
            
            // Показываем сообщение с ключами
            let keysMessage = "✅ ОПЛАТА ПОДТВЕРЖДЕНА!\n\nВаши цифровые товары:\n\n";
            for (const item of cart) {
                keysMessage += `📦 ${item.name} x${item.quantity || 1}\n🔑 Ключ: ${item.key || 'Будет отправлен на email'}\n\n`;
            }
            keysMessage += "\n📧 Ключи также отправлены на вашу почту: " + currentUser.email;
            
            alert(keysMessage);
            
            // Очищаем корзину
            saveCart([]);
            displayCartItems();
            
            // Закрываем модальное окно
            closePaymentModal();
            
            showNotification('Заказ успешно оформлен! Товары отправлены на email', 'success');
            
            // Обновляем страницу через 2 секунды
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            showNotification('Ошибка при оформлении заказа', 'error');
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Я оплатил';
            }
        }
    }, 1500);
};

// ==================== ПЕРЕКЛЮЧЕНИЕ КОРЗИНЫ ====================

// Переключение видимости боковой панели корзины (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
window.toggleCart = function() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
};

// ==================== УВЕДОМЛЕНИЯ ====================

// Показ уведомления (ГЛОБАЛЬНАЯ ФУНКЦИЯ)
window.showNotification = function(message, type = 'success') {
    // Проверяем, есть ли контейнер для уведомлений
    let notification = document.getElementById('customNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'customNotification';
        notification.className = 'custom-notification';
        document.body.appendChild(notification);
        
        // Добавляем стили для уведомлений
        if (!document.getElementById('notificationStyles')) {
            const styles = document.createElement('style');
            styles.id = 'notificationStyles';
            styles.textContent = `
                .custom-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10001;
                    animation: slideInRight 0.3s ease;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .custom-notification-content {
                    background: #1e293b;
                    border-left: 4px solid #7c3aed;
                    padding: 12px 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .custom-notification-content.success {
                    border-left-color: #10b981;
                }
                .custom-notification-content.error {
                    border-left-color: #ef4444;
                }
                .custom-notification-content.info {
                    border-left-color: #3b82f6;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';
    
    notification.innerHTML = `
        <div class="custom-notification-content ${type}">
            <span>${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    setTimeout(() => {
        notification.innerHTML = '';
    }, 3000);
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart.js инициализирован');
    updateCartCountDisplay();
    displayCartItems();
    
    // Обновляем интерфейс корзины при изменении storage
    window.addEventListener('storage', function(e) {
        if (e.key === 'volt_cart') {
            updateCartCountDisplay();
            displayCartItems();
        }
    });
});

// Экспортируем функции в глобальную область видимости
window.getCart = getCart;
window.saveCart = saveCart;
window.updateCartCountDisplay = updateCartCountDisplay;
window.displayCartItems = displayCartItems;
