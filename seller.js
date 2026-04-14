// ==================== ПАНЕЛЬ ПРОДАВЦА С FIRESTORE ====================

let sellerProducts = [];
let sellerOrders = [];

document.addEventListener('DOMContentLoaded', async function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'seller') {
        alert('Доступ запрещен. Только для продавцов.');
        window.location.href = 'index.html';
        return;
    }
    
    await loadSellerData();
    
    // Форма добавления товара
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newProduct = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseInt(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value,
                key: document.getElementById('productKey').value,
                image: document.getElementById('productImage') ? document.getElementById('productImage').value : 'box',
                sellerId: currentUser.id,
                sellerName: currentUser.name,
                rating: 5.0,
                reviews: 0,
                oldPrice: null,
                discount: 0,
                badge: 'new'
            };
            
            try {
                if (window.db && window.db.addProduct) {
                    const added = await window.db.addProduct(newProduct);
                    alert('Товар успешно добавлен в облачную базу данных!');
                    addForm.reset();
                    await loadSellerData();
                } else {
                    // Fallback на localStorage
                    addProduct(newProduct);
                    alert('Товар успешно добавлен!');
                    addForm.reset();
                    loadSellerData();
                }
            } catch (error) {
                console.error('Ошибка добавления товара:', error);
                alert('Ошибка при добавлении товара: ' + error.message);
            }
        });
    }
});

async function loadSellerData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    if (window.db && window.db.getSellerProducts) {
        sellerProducts = await window.db.getSellerProducts(currentUser.id);
        sellerOrders = await window.db.getSellerOrders(currentUser.id);
    } else {
        sellerProducts = getSellerProducts(currentUser.id);
        sellerOrders = getSellerOrders(currentUser.id);
    }
    
    loadSellerStats();
    loadSellerProducts();
    loadSellerOrders();
}

function loadSellerStats() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const totalEarned = sellerOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    const pendingAmount = sellerOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('totalProducts').textContent = sellerProducts.length;
    document.getElementById('totalSales').textContent = sellerOrders.length;
    document.getElementById('totalEarnings').textContent = totalEarned.toLocaleString() + ' ₽';
    document.getElementById('pendingBalance').textContent = pendingAmount.toLocaleString() + ' ₽';
}

function loadSellerProducts() {
    const tbody = document.getElementById('sellerProductsList');
    if (!tbody) return;
    
    if (sellerProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center">У вас пока нет товаров</td></tr>';
        return;
    }
    
    tbody.innerHTML = sellerProducts.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.price} ₽</td>
            <td>${p.category}</td>
            <td>${p.soldCount || 0}</td>
            <td>
                <button class="edit-btn" onclick="editProduct('${p.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteProductConfirm('${p.id}')"><i class="fas fa-trash"></i></button>
             </td>
        </tr>
    `).join('');
}

function loadSellerOrders() {
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
                ${o.status === 'paid' ? `<button class="edit-btn" onclick="sendProductKey('${o.id}', '${o.productKey}')">Отправить ключ</button>` : ''}
             </td>
        </tr>
    `).join('');
}

window.sendProductKey = async function(orderId, productKey) {
    if (confirm('Отправить ключ покупателю?')) {
        if (window.db && window.db.updateOrderStatus) {
            await window.db.updateOrderStatus(orderId, 'delivered');
            alert(`Ключ отправлен: ${productKey}`);
            await loadSellerData();
        } else {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const orderIndex = orders.findIndex(o => o.id == orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'delivered';
                localStorage.setItem('orders', JSON.stringify(orders));
                alert(`Ключ отправлен: ${productKey}`);
                loadSellerData();
            }
        }
    }
};

window.deleteProductConfirm = async function(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        if (window.db && window.db.deleteProduct) {
            await window.db.deleteProduct(productId);
            alert('Товар удален из облачной базы данных');
            await loadSellerData();
        } else {
            deleteProduct(productId);
            alert('Товар удален');
            loadSellerData();
        }
    }
};

window.editProduct = async function(productId) {
    const product = sellerProducts.find(p => p.id == productId);
    if (!product) return;
    
    const newName = prompt('Новое название:', product.name);
    const newPrice = prompt('Новая цена:', product.price);
    
    if (newName && newPrice) {
        if (window.db && window.db.updateProduct) {
            await window.db.updateProduct(productId, {
                name: newName,
                price: parseInt(newPrice)
            });
            alert('Товар обновлен в облачной базе данных');
            await loadSellerData();
        } else {
            updateProduct(productId, { name: newName, price: parseInt(newPrice) });
            alert('Товар обновлен');
            loadSellerData();
        }
    }
};

window.switchTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
};

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
