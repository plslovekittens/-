// ==================== DATABASE (localStorage Fallback) ====================

// Инициализация базы данных
function initDatabase() {
    // Пользователи
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 1,
                name: "Admin Seller",
                email: "seller@volt.com",
                password: "seller123",
                role: "seller",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Test Buyer",
                email: "buyer@volt.com",
                password: "buyer123",
                role: "buyer",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Товары
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: 1,
                name: "Cyberpunk 2077",
                category: "games",
                price: 1990,
                oldPrice: 2990,
                discount: 33,
                rating: 4.5,
                reviews: 1250,
                image: "gamepad",
                badge: "sale",
                sellerId: 1,
                sellerName: "Admin Seller",
                key: "XXXX-XXXX-XXXX-XXXX",
                soldCount: 45,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Microsoft Office 2024",
                category: "software",
                price: 3990,
                oldPrice: 7990,
                discount: 50,
                rating: 4.8,
                reviews: 3420,
                image: "file-alt",
                badge: "popular",
                sellerId: 1,
                sellerName: "Admin Seller",
                key: "YYYY-YYYY-YYYY-YYYY",
                soldCount: 28,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Discord Nitro",
                category: "subscriptions",
                price: 299,
                oldPrice: 499,
                discount: 40,
                rating: 4.7,
                reviews: 8900,
                image: "discord",
                badge: "popular",
                sellerId: 1,
                sellerName: "Admin Seller",
                key: "ZZZZ-ZZZZ-ZZZZ-ZZZZ",
                soldCount: 156,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    // Заказы
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    // Транзакции продавцов
    if (!localStorage.getItem('sellerTransactions')) {
        localStorage.setItem('sellerTransactions', JSON.stringify([]));
    }
    
    // Отзывы
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }
}

// Получение всех товаров
function getAllProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Получение товаров продавца
function getSellerProducts(sellerId) {
    const products = getAllProducts();
    return products.filter(p => p.sellerId == sellerId);
}

// Добавление товара
function addProduct(product) {
    const products = getAllProducts();
    product.id = Date.now();
    product.createdAt = new Date().toISOString();
    product.soldCount = 0;
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    return product;
}

// Обновление товара
function updateProduct(productId, updatedData) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id == productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        localStorage.setItem('products', JSON.stringify(products));
        return products[index];
    }
    return null;
}

// Удаление товара
function deleteProduct(productId) {
    let products = getAllProducts();
    products = products.filter(p => p.id != productId);
    localStorage.setItem('products', JSON.stringify(products));
}

// Получение заказов продавца
function getSellerOrders(sellerId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.sellerId == sellerId);
}

// Создание заказа
function createOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    order.id = Date.now();
    order.status = 'paid';
    order.createdAt = new Date().toISOString();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

// Обновление статуса заказа
function updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id == orderId);
    if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        if (status === 'completed') {
            const sellerTransactions = JSON.parse(localStorage.getItem('sellerTransactions')) || [];
            sellerTransactions.push({
                sellerId: orders[index].sellerId,
                amount: orders[index].total,
                orderId: orderId,
                type: 'earning',
                date: new Date().toISOString()
            });
            localStorage.setItem('sellerTransactions', JSON.stringify(sellerTransactions));
        }
        return orders[index];
    }
    return null;
}

// Получение корзины
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Сохранение корзины
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountDisplay();
}

function updateCartCountDisplay() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Инициализация
initDatabase();
