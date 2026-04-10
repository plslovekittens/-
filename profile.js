// ==================== ЛИЧНЫЙ КАБИНЕТ ====================

let currentSupportUser = null;

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Отображаем информацию о пользователе
    document.getElementById('userNameDisplay').textContent = currentUser.name;
    document.getElementById('userEmailDisplay').textContent = currentUser.email;
    document.getElementById('userRoleDisplay').textContent = currentUser.role === 'seller' ? 'Продавец' : 'Покупатель';
    document.getElementById('userDateDisplay').textContent = new Date(currentUser.createdAt).toLocaleDateString('ru-RU');
    
    // Показываем/скрываем вкладки для продавца
    if (currentUser.role === 'seller') {
        document.getElementById('sellerOrdersTab').style.display = 'inline-block';
        document.getElementById('sellerReviewsTab').style.display = 'inline-block';
        document.getElementById('sellerWithdrawTab').style.display = 'inline-block';
    }
    
    // Загружаем заказы
    loadUserOrders(currentUser.id);
    loadPromoCodes(currentUser.id);
    loadSellerIncomingOrders(currentUser.id);
    loadSellerReviews(currentUser.id);
    loadSellerBalance(currentUser.id);
});

// Переключение вкладок
function switchProfileTab(tab) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tab}Pane`).classList.add('active');
    
    document.querySelectorAll('.profile-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Загрузка заказов пользователя
function loadUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.buyerId == userId);
    const container = document.getElementById('ordersList');
    
    if (userOrders.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #a1a1aa;">У вас пока нет заказов</div>';
        return;
    }
    
    container.innerHTML = userOrders.map(order => `
        <div class="order-card">
            <div>
                <strong>${order.productName}</strong><br>
                Количество: ${order.quantity} шт.<br>
                Сумма: ${order.total} ₽<br>
                Дата: ${new Date(order.createdAt).toLocaleDateString('ru-RU')}
            </div>
            <div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                ${order.status === 'delivered' ? `
                    <button class="btn btn-primary" style="margin-top: 10px; padding: 5px 10px;" onclick="confirmReceipt(${order.id})">
                        Подтвердить получение
                    </button>
                ` : ''}
                ${order.status === 'paid' ? `
                    <div style="margin-top: 10px; font-size: 12px; color: #f59e0b;">
                        ⏳ Ожидает отправки от продавца
                    </div>
                ` : ''}
                ${order.status === 'completed' ? `
                    <div style="margin-top: 10px; font-size: 12px; color: #10b981;">
                        ✅ Товар получен. Деньги переведены продавцу
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Подтверждение получения товара
function confirmReceipt(orderId) {
    if (confirm('Вы подтверждаете получение товара? Деньги будут переведены продавцу.')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id == orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'completed';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Переводим деньги продавцу (обновляем баланс)
            const sellerTransactions = JSON.parse(localStorage.getItem('sellerTransactions')) || [];
            sellerTransactions.push({
                sellerId: orders[orderIndex].sellerId,
                amount: orders[orderIndex].total,
                orderId: orderId,
                type: 'earning',
                date: new Date().toISOString()
            });
            localStorage.setItem('sellerTransactions', JSON.stringify(sellerTransactions));
            
            alert('Спасибо за подтверждение! Деньги переведены продавцу.');
            location.reload();
        }
    }
}

// Загрузка промокодов
function loadPromoCodes(userId) {
    const promoCodes = JSON.parse(localStorage.getItem('promoCodes')) || [];
    const userPromoCodes = promoCodes.filter(p => p.userId == userId);
    const container = document.getElementById('promoCodesList');
    
    // Добавляем базовые промокоды для примера
    const defaultPromos = [
        { code: "WELCOME10", discount: 10, used: false },
        { code: "VOLT20", discount: 20, used: false }
    ];
    
    container.innerHTML = `
        <div class="promo-card">
            <h4>Доступные промокоды</h4>
            ${defaultPromos.map(p => `
                <div class="promo-code">
                    ${p.code} - скидка ${p.discount}%
                    <button class="btn btn-secondary" style="margin-left: 10px;" onclick="copyPromoCode('${p.code}')">
                        Скопировать
                    </button>
                </div>
            `).join('')}
            <p style="margin-top: 15px; font-size: 12px;">* Промокоды действуют на первый заказ</p>
        </div>
    `;
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code);
    alert(`Промокод ${code} скопирован!`);
}

// Загрузка поступления товаров (для продавца)
function loadSellerIncomingOrders(sellerId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const sellerOrders = orders.filter(o => o.sellerId == sellerId && o.status !== 'completed');
    const container = document.getElementById('sellerIncomingOrders');
    
    if (sellerOrders.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #a1a1aa;">Нет активных заказов</div>';
        return;
    }
    
    container.innerHTML = sellerOrders.map(order => `
        <div class="order-card">
            <div>
                <strong>${order.productName}</strong><br>
                Покупатель: ${order.buyerName}<br>
                Количество: ${order.quantity} шт.<br>
                Сумма: ${order.total} ₽
            </div>
            <div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                ${order.status === 'paid' ? `
                    <button class="btn btn-primary" style="margin-top: 10px; padding: 5px 10px;" onclick="sendProductKey(${order.id}, '${order.productKey}')">
                        Отправить ключ
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Отправка ключа покупателю
function sendProductKey(orderId, productKey) {
    if (confirm('Отправить ключ покупателю? После отправки покупатель сможет подтвердить получение.')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id == orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'delivered';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            alert(`Ключ отправлен: ${productKey}`);
            location.reload();
        }
    }
}

// Загрузка отзывов
function loadSellerReviews(sellerId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const sellerReviews = reviews.filter(r => r.sellerId == sellerId);
    const container = document.getElementById('sellerReviewsList');
    
    if (sellerReviews.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #a1a1aa;">Пока нет отзывов</div>';
        return;
    }
    
    container.innerHTML = sellerReviews.map(review => `
        <div class="order-card">
            <div>
                <strong>${review.productName}</strong><br>
                Покупатель: ${review.buyerName}<br>
                Оценка: ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}<br>
                Отзыв: "${review.comment}"
            </div>
        </div>
    `).join('');
}

// Загрузка баланса продавца
function loadSellerBalance(sellerId) {
    const transactions = JSON.parse(localStorage.getItem('sellerTransactions')) || [];
    const sellerEarnings = transactions.filter(t => t.sellerId == sellerId && t.type === 'earning');
    const totalEarned = sellerEarnings.reduce((sum, t) => sum + t.amount, 0);
    
    // Считаем удержанные средства (ожидающие подтверждения)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const pendingOrders = orders.filter(o => o.sellerId == sellerId && o.status === 'delivered');
    const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('availableBalance').textContent = totalEarned + ' ₽';
    document.getElementById('pendingBalance').textContent = pendingAmount + ' ₽';
}

// Запрос на вывод средств
function requestWithdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    if (!amount || amount <= 0) {
        alert('Введите корректную сумму');
        return;
    }
    
    alert(`Заявка на вывод ${amount} ₽ отправлена. Ожидайте 3-5 рабочих дней.`);
    document.getElementById('withdrawAmount').value = '';
}

// Отправка сообщения в поддержку
function sendSupportMessage() {
    const input = document.getElementById('supportInput');
    const message = input.value.trim();
    if (!message) return;
    
    const messagesContainer = document.getElementById('supportMessages');
    
    // Добавляем сообщение пользователя
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = message;
    messagesContainer.appendChild(userMsg);
    
    input.value = '';
    
    // Автоответ
    setTimeout(() => {
        const supportMsg = document.createElement('div');
        supportMsg.className = 'message support';
        supportMsg.textContent = 'Спасибо за обращение! Наш специалист свяжется с вами в ближайшее время.';
        messagesContainer.appendChild(supportMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Получение текста статуса
function getStatusText(status) {
    const statuses = {
        'pending': '⏳ Ожидает оплаты',
        'paid': '✅ Оплачено, ожидает отправки',
        'delivered': '📦 Товар отправлен, ожидает подтверждения',
        'completed': '🎉 Завершен',
        'disputed': '⚠️ Спор'
    };
    return statuses[status] || status;
}
