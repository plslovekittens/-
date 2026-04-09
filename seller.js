// ==================== ПАНЕЛЬ ПРОДАВЦА ====================

document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации продавца
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'seller') {
        alert('Доступ запрещен. Только для продавцов.');
        window.location.href = 'index.html';
        return;
    }
    
    // Загрузка данных
    loadSellerStats();
    loadSellerProducts();
    loadSellerOrders();
    
    // Форма добавления товара
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newProduct = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseInt(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value,
                key: document.getElementById('productKey').value,
                image: document.getElementById('productImage').value,
                sellerId: currentUser.id,
                sellerName: currentUser.name,
                rating: 5.0,
                reviews: 0,
                oldPrice: null,
                discount: 0,
                badge: 'new'
            };
            
            addProduct(newProduct);
            alert('Товар успешно добавлен!');
            addForm.reset();
            loadSellerProducts();
            loadSellerStats();
        });
    }
});

// Загрузка статистики
function loadSellerStats() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const products = getSellerProducts(currentUser.id);
    const orders = getSellerOrders(currentUser.id);
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingBalance = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalSales').textContent = orders.length;
    document.getElementById('totalEarnings').textContent = totalSales.toLocaleString() + ' ₽';
    document.getElementById('pendingBalance').textContent = pendingBalance.toLocaleString() + ' ₽';
}

// Загрузка товаров продавца
function loadSellerProducts() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const products = getSellerProducts(currentUser.id);
    const tbody = document.getElementById('sellerProductsList');
    
    if (!tbody) return;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center">У вас пока нет товаров</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.price} ₽</td>
            <td>${p.category}</td>
            <td>${p.soldCount || 0}</td>
            <td>
                <button class="edit-btn" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteProductConfirm(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Загрузка заказов
function loadSellerOrders() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const orders = getSellerOrders(currentUser.id);
    const tbody = document.getElementById('ordersList');
    
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center">Нет заказов</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td>${o.productName} x${o.quantity}</td>
            <td>${o.buyerName}</td>
            <td>${o.total} ₽</td>
            <td><span class="status ${o.status}">${getStatusText(o.status)}</span></td>
            <td>
                ${o.status === 'paid' ? `<button class="edit-btn" onclick="confirmDelivery(${o.id})">Подтвердить доставку</button>` : ''}
            </td>
        </tr>
    `).join('');
}

// Подтверждение доставки
function confirmDelivery(orderId) {
    if (confirm('Подтвердите, что товар был передан покупателю. Средства будут зачислены на ваш счет.')) {
        updateOrderStatus(orderId, 'completed');
        loadSellerOrders();
        loadSellerStats();
        alert('Доставка подтверждена! Средства зачислены на ваш счет.');
    }
}

// Удаление товара
function deleteProductConfirm(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        deleteProduct(productId);
        loadSellerProducts();
        loadSellerStats();
        alert('Товар удален');
    }
}

// Редактирование товара
function editProduct(productId) {
    const products = getAllProducts();
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const newName = prompt('Новое название:', product.name);
    const newPrice = prompt('Новая цена:', product.price);
    
    if (newName && newPrice) {
        updateProduct(productId, {
            name: newName,
            price: parseInt(newPrice)
        });
        loadSellerProducts();
        alert('Товар обновлен');
    }
}

// Переключение вкладок
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Вспомогательные функции
function getStatusText(status) {
    const statuses = {
        'pending': '⏳ Ожидает оплаты',
        'paid': '✅ Оплачено, ожидает доставки',
        'delivered': '📦 Доставлено',
        'completed': '🎉 Завершен'
    };
    return statuses[status] || status;
}
