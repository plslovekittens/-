// ==================== ЛИЧНЫЙ КАБИНЕТ ====================

async function loadProfile() {
    const container = document.getElementById('profileContent');
    const currentUser = window.getCurrentUser();
    
    if (!currentUser) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <i class="fas fa-exclamation-triangle" style="font-size:48px; color:#ef4444;"></i>
                <p>Вы не авторизованы</p>
                <a href="login.html" class="btn">Войти</a>
            </div>
        `;
        return;
    }
    
    // Получаем данные пользователя из коллекции users
    const userResult = await window.DB.getUser(currentUser.id);
    // Получаем заказы пользователя из коллекции orders
    const ordersResult = await window.DB.getUserOrders(currentUser.id);
    
    const userData = userResult.success ? userResult.data : { name: currentUser.name, email: currentUser.email, role: 'buyer' };
    const orders = ordersResult.success ? ordersResult.data : [];
    
    container.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar"><i class="fas fa-user"></i></div>
            <div class="profile-info">
                <h2>${escapeHtml(userData.name)}</h2>
                <p>${currentUser.email}</p>
                <p><span style="background:rgba(255,255,255,0.2); padding:4px 12px; border-radius:20px;">${userData.role === 'seller' ? 'Продавец' : 'Покупатель'}</span></p>
                <p>Баланс: ${(userData.balance || 0).toLocaleString()} ₽</p>
            </div>
        </div>
        <div style="background:#111118; border-radius:20px; padding:30px;">
            <h3 style="margin-bottom:20px;">📦 Мои заказы (${orders.length})</h3>
            <div id="ordersContainer">${renderOrders(orders)}</div>
        </div>
    `;
}

function renderOrders(orders) {
    if (orders.length === 0) {
        return '<div style="text-align:center; padding:40px; color:#a1a1aa;">У вас пока нет заказов</div>';
    }
    
    return orders.map(order => `
        <div class="order-card">
            <div>
                <strong>${escapeHtml(order.productName)}</strong><br>
                Количество: ${order.quantity} шт.<br>
                Сумма: ${order.total} ₽<br>
                Дата: ${new Date(order.createdAt).toLocaleDateString('ru-RU')}
            </div>
            <div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statuses = {
        'pending': '⏳ Ожидает оплаты',
        'paid': '✅ Оплачено',
        'delivered': '📦 Доставлено',
        'completed': '🎉 Завершен'
    };
    return statuses[status] || status;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
});
