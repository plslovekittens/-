// ==================== ПАНЕЛЬ ПРОДАВЦА ====================

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = window.getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'seller') {
        alert('Доступ запрещен. Только для продавцов.');
        window.location.href = 'index.html';
        return;
    }
    
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

function loadSellerStats() {
    const currentUser = window.getCurrentUser();
    if (!currentUser) return;
    
    const products = getSellerProducts(currentUser.id);
    const transactions = JSON.parse(localStorage.getItem('sellerTransactions')) || [];
    const sellerEarnings = transactions.filter(t => t.sellerId == currentUser.id && t.type === 'earning');
    const totalEarned = sellerEarnings.reduce((sum, t) => sum + t.amount, 0);
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const sellerOrders = orders.filter(o => o.sellerId == currentUser.id);
    const pendingOrders = orders.filter(o => o.sellerId == currentUser.id && o.status === 'delivered');
    const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalSales').textContent = sellerOrders.length;
    document.getElementById('totalEarnings').textContent = totalEarned.toLocaleString() + ' ₽';
    document.getElementById('pendingBalance').textContent = pendingAmount.toLocaleString() + ' ₽';
}

function loadSellerProducts() {
    const currentUser = window.getCurrentUser();
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

function loadSellerOrders() {
    const currentUser = window.getCurrentUser();
    if (!currentUser) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const sellerOrders = orders.filter(o => o.sellerId == currentUser.id);
    const tbody = document.getElementById('ordersList');
    
    if (!tbody) return;
    
    if (sellerOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center">Нет заказов</td></tr>';
        return;
    }
    
    tbody.innerHTML = sellerOrders.map(o => `
        <tr>
            <td>${o.productName} x${o.quantity}</td>
            <td>${o.buyerName}</td>
            <td>${o.total} ₽</td>
            <td class="status-${o.status}">${getStatusText(o.status)}</td>
            <td>
                ${o.status === 'paid' ? `<button class="edit-btn" onclick="sendProductKey(${o.id}, '${o.productKey}')">Отправить ключ</button>` : ''}
             </td>
        </tr>
    `).join('');
}

function sendProductKey(orderId, productKey) {
    if (confirm('Отправить ключ покупателю?')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id == orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'delivered';
            localStorage.setItem('orders', JSON.stringify(orders));
            alert(`Ключ отправлен: ${productKey}`);
            loadSellerOrders();
            loadSellerStats();
        }
    }
}

function deleteProductConfirm(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        deleteProduct(productId);
        loadSellerProducts();
        loadSellerStats();
        alert('Товар удален');
    }
}

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

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function getStatusText(status) {
    const statuses = {
        'pending': '⏳ Ожидает оплаты',
        'paid': '✅ Оплачено (деньги на удержании)',
        'delivered': '📦 Ключ отправлен, ожидает подтверждения',
        'completed': '🎉 Завершен (деньги получены)',
        'disputed': '⚠️ Спор'
    };
    return statuses[status] || status;
}
