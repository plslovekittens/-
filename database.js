// ==================== БАЗА ДАННЫХ ====================

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
                createdAt: new Date().toISOString(),
                balance: 0
            },
            {
                id: 2,
                name: "Test Buyer",
                email: "buyer@volt.com",
                password: "buyer123",
                role: "buyer",
                createdAt: new Date().toISOString(),
                balance: 0
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Товары (много игр и программ)
    if (!localStorage.getItem('products')) {
        const defaultProducts = generateProducts();
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
    
    // Промокоды
    if (!localStorage.getItem('promoCodes')) {
        localStorage.setItem('promoCodes', JSON.stringify([]));
    }
}

// Генерация товаров
function generateProducts() {
    const games = [
        { name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale" },
        { name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new" },
        { name: "Red Dead Redemption 2", category: "games", price: 2290, oldPrice: 3990, discount: 42, image: "horse", badge: "sale" },
        { name: "Elden Ring", category: "games", price: 2790, oldPrice: 3990, discount: 30, image: "crown", badge: "popular" },
        { name: "Hogwarts Legacy", category: "games", price: 2790, oldPrice: 3990, discount: 30, image: "hat-wizard", badge: "new" },
        { name: "The Witcher 3", category: "games", price: 1490, oldPrice: 2990, discount: 50, image: "hat-wizard", badge: "sale" },
        { name: "Grand Theft Auto V", category: "games", price: 1490, oldPrice: 2990, discount: 50, image: "car", badge: "sale" },
        { name: "Call of Duty: MW3", category: "games", price: 3990, oldPrice: 5990, discount: 33, image: "gun", badge: "new" },
        { name: "Starfield", category: "games", price: 3490, oldPrice: 4990, discount: 30, image: "rocket", badge: "new" },
        { name: "Diablo IV", category: "games", price: 3490, oldPrice: 4990, discount: 30, image: "skull", badge: "new" },
        { name: "S.T.A.L.K.E.R. 2", category: "games", price: 2990, oldPrice: 4490, discount: 33, image: "radiation", badge: "new" },
        { name: "Cities Skylines II", category: "games", price: 2990, oldPrice: 4490, discount: 33, image: "city", badge: "new" },
        { name: "Microsoft Flight Simulator", category: "games", price: 3990, oldPrice: 5990, discount: 33, image: "plane", badge: "new" },
        { name: "EA Sports FC 24", category: "games", price: 2990, oldPrice: 4490, discount: 33, image: "futbol", badge: "sale" },
        { name: "Assassin's Creed Mirage", category: "games", price: 2490, oldPrice: 3990, discount: 37, image: "mask", badge: "sale" }
    ];
    
    const software = [
        { name: "Microsoft Office 2024 Pro", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular" },
        { name: "Adobe Photoshop 2024", category: "software", price: 2990, oldPrice: 5990, discount: 50, image: "paint-brush", badge: "popular" },
        { name: "Adobe Premiere Pro 2024", category: "software", price: 3490, oldPrice: 6990, discount: 50, image: "video", badge: "popular" },
        { name: "Adobe Illustrator 2024", category: "software", price: 2990, oldPrice: 5990, discount: 50, image: "pen", badge: "popular" },
        { name: "AutoCAD 2024", category: "software", price: 4990, oldPrice: 9990, discount: 50, image: "draw-polygon", badge: "professional" },
        { name: "Visual Studio 2024", category: "software", price: 4490, oldPrice: 8990, discount: 50, image: "code", badge: "new" },
        { name: "PyCharm Professional", category: "software", price: 1990, oldPrice: 3990, discount: 50, image: "python", badge: "popular" },
        { name: "IntelliJ IDEA", category: "software", price: 2490, oldPrice: 4990, discount: 50, image: "java", badge: "popular" }
    ];
    
    const subscriptions = [
        { name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular" },
        { name: "Telegram Premium", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "telegram", badge: "new" },
        { name: "Яндекс Плюс", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "plus-circle", badge: "popular" },
        { name: "Spotify Premium", category: "subscriptions", price: 399, oldPrice: 699, discount: 42, image: "spotify", badge: "popular" },
        { name: "Netflix Basic", category: "subscriptions", price: 699, oldPrice: 999, discount: 30, image: "netflix", badge: "new" },
        { name: "YouTube Premium", category: "subscriptions", price: 399, oldPrice: 699, discount: 42, image: "youtube", badge: "popular" }
    ];
    
    const allProducts = [...games, ...software, ...subscriptions];
    
    return allProducts.map((p, index) => ({
        id: index + 1,
        name: p.name,
        category: p.category,
        price: p.price,
        oldPrice: p.oldPrice,
        discount: p.discount,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 5000),
        image: p.image,
        badge: p.badge,
        sellerId: 1,
        sellerName: "Admin Seller",
        key: `XXXX-XXXX-XXXX-${index + 1000}`,
        soldCount: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString()
    }));
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

// Добавление товара (только для продавцов)
function addProduct(product) {
    const products = getAllProducts();
    product.id = Date.now();
    product.createdAt = new Date().toISOString();
    product.soldCount = 0;
    product.rating = 5.0;
    product.reviews = 0;
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

// Создание заказа с escrow (деньги замораживаются)
function createOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    order.id = Date.now();
    order.status = 'paid'; // Оплачено, деньги на удержании
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
        
        // Если заказ завершен (покупатель подтвердил), переводим деньги продавцу
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

// Корзина
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

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
