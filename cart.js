// ==================== КОРЗИНА С ОПЛАТОЙ ====================

// Добавление в корзину
function addToCart(productId) {
    const products = getAllProducts();
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            key: product.key,
            status: 'pending'
        });
    }
    
    saveCart(cart);
    showNotification('Товар добавлен в корзину', 'success');
    displayCartItems();
}

// Удаление из корзины
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    displayCartItems();
    showNotification('Товар удален из корзины', 'success');
}

// Обновление количества
function updateCartQuantity(productId, change) {
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
}

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
                <div class="cart-item-image">
                    <i class="fas fa-${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    if (totalElement) totalElement.textContent = `${total} ₽`;
}

// Переключение корзины
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Оформление заказа с оплатой
function checkout() {
    const cart = getCart();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
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
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Показываем модальное окно с оплатой
    showPaymentModal(cart, total);
}

// Показ модального окна оплаты
function showPaymentModal(cart, total) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3>Оплата через СБП</h3>
                <button onclick="this.closest('.payment-modal').remove()"><i class="fas fa-times"></i></button>
            </div>
            <div class="payment-modal-body">
                <div class="payment-qr">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-qrcode" style="font-size: 80px; color: #7c3aed;"></i>
                    </div>
                    <div class="payment-details">
                        <p><strong>Сумма к оплате:</strong> ${total} ₽</p>
                        <p><strong>Номер заказа:</strong> VOLT-${Date.now().toString().slice(-8)}</p>
                        <p><strong>Получатель:</strong> VOLT Store</p>
                        <p style="font-size: 12px; color: #666; margin-top: 15px;">Оплатите по QR-коду в приложении вашего банка</p>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary btn-full" onclick="processPayment(this, ${total})" style="width: 100%;">
                        Я оплатил
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .payment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        }
        .payment-modal-content {
            background: #111118;
            border: 1px solid #7c3aed;
            border-radius: 20px;
            max-width: 450px;
            width: 90%;
            animation: fadeInUp 0.3s ease;
        }
        .payment-modal-header {
            padding: 20px;
            border-bottom: 1px solid rgba(124,58,237,0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .payment-modal-header button {
            background: none;
            border: none;
            color: #a1a1aa;
            font-size: 20px;
            cursor: pointer;
        }
        .payment-modal-body {
            padding: 20px;
        }
        .payment-qr {
            text-align: center;
            padding: 20px;
            background: rgba(124,58,237,0.05);
            border-radius: 16px;
        }
        .payment-details {
            text-align: left;
            margin-top: 20px;
            padding: 15px;
            background: #0a0a0f;
            border-radius: 12px;
        }
        .payment-details p {
            margin: 10px 0;
            color: white;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Обработка оплаты
function processPayment(button, total) {
    // Имитация проверки оплаты
    button.disabled = true;
    button.textContent = 'Проверка оплаты...';
    
    // Симуляция задержки проверки оплаты
    setTimeout(() => {
        const cart = getCart();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser) return;
        
        // Создаем заказы
        for (let item of cart) {
            const order = {
                id: Date.now(),
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
            
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Увеличиваем счетчик продаж товара
            const products = getAllProducts();
            const product = products.find(p => p.id == item.id);
            if (product) {
                product.soldCount = (product.soldCount || 0) + item.quantity;
                updateProduct(item.id, product);
            }
        }
        
        // Отправка ключей покупателю
        let keysMessage = "✅ ОПЛАТА ПОДТВЕРЖДЕНА!\n\nВаши цифровые товары:\n\n";
        for (let item of cart) {
            keysMessage += `📦 ${item.name} x${item.quantity}\n🔑 Ключ: ${item.key}\n\n`;
        }
        keysMessage += "Товары также отправлены на ваш email: " + currentUser.email;
        
        alert(keysMessage);
        
        // Очищаем корзину
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Закрываем модальное окно
        const modal = document.querySelector('.payment-modal');
        if (modal) modal.remove();
        
        // Обновляем интерфейс
        updateCartCountDisplay();
        displayCartItems();
        
        showNotification('Оплата прошла успешно! Товары отправлены на email', 'success');
        
        // Закрываем корзину
        toggleCart();
        
    }, 2000);
}

// Вспомогательная функция для обновления товара
function updateProduct(productId, updatedData) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </
