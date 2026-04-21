// ==================== ВСЕ ОПЕРАЦИИ С FIRESTORE ====================

// ========== 1. ПОЛЬЗОВАТЕЛИ (users) ==========
async function createUser(userId, userData) {
    try {
        await window.db.collection('users').doc(userId).set({
            name: userData.name,
            email: userData.email,
            role: userData.role || 'buyer',
            createdAt: new Date().toISOString(),
            balance: 0,
            isActive: true
        });
        console.log('✅ Пользователь создан в коллекции users');
        return { success: true };
    } catch (error) {
        console.error('❌ Ошибка создания пользователя:', error);
        return { success: false, error: error.message };
    }
}

async function getUser(userId) {
    try {
        const doc = await window.db.collection('users').doc(userId).get();
        if (doc.exists) {
            return { success: true, data: { id: doc.id, ...doc.data() } };
        }
        return { success: false, error: 'Пользователь не найден' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateUserBalance(userId, newBalance) {
    try {
        await window.db.collection('users').doc(userId).update({
            balance: newBalance,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 2. ТОВАРЫ (products) ==========
async function addProduct(productData) {
    try {
        const docRef = await window.db.collection('products').add({
            ...productData,
            createdAt: new Date().toISOString(),
            soldCount: 0,
            rating: 0,
            reviewsCount: 0,
            isActive: true
        });
        console.log('✅ Товар добавлен в коллекцию products, ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Ошибка добавления товара:', error);
        return { success: false, error: error.message };
    }
}

async function getAllProducts() {
    try {
        const snapshot = await window.db.collection('products').where('isActive', '==', true).get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: products };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

async function getProductsBySeller(sellerId) {
    try {
        const snapshot = await window.db.collection('products')
            .where('sellerId', '==', sellerId)
            .where('isActive', '==', true)
            .get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: products };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

async function updateProduct(productId, updatedData) {
    try {
        await window.db.collection('products').doc(productId).update({
            ...updatedData,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteProduct(productId) {
    try {
        await window.db.collection('products').doc(productId).update({
            isActive: false,
            deletedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 3. ЗАКАЗЫ (orders) ==========
async function createOrder(orderData) {
    try {
        const docRef = await window.db.collection('orders').add({
            ...orderData,
            status: 'paid',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Заказ создан в коллекции orders, ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        return { success: false, error: error.message };
    }
}

async function getUserOrders(userId) {
    try {
        const snapshot = await window.db.collection('orders')
            .where('buyerId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: orders };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

async function getSellerOrders(sellerId) {
    try {
        const snapshot = await window.db.collection('orders')
            .where('sellerId', '==', sellerId)
            .orderBy('createdAt', 'desc')
            .get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: orders };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        await window.db.collection('orders').doc(orderId).update({
            status: status,
            updatedAt: new Date().toISOString()
        });
        
        // Если заказ завершён, добавляем транзакцию продавцу
        if (status === 'completed') {
            const orderDoc = await window.db.collection('orders').doc(orderId).get();
            const order = orderDoc.data();
            await createTransaction({
                sellerId: order.sellerId,
                amount: order.total,
                type: 'earning',
                orderId: orderId,
                status: 'completed'
            });
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 4. ОТЗЫВЫ (reviews) ==========
async function addReview(reviewData) {
    try {
        const docRef = await window.db.collection('reviews').add({
            ...reviewData,
            createdAt: new Date().toISOString()
        });
        console.log('✅ Отзыв добавлен в коллекцию reviews');
        
        // Обновляем рейтинг товара
        const productDoc = await window.db.collection('products').doc(reviewData.productId).get();
        const product = productDoc.data();
        const newRating = (product.rating * product.reviewsCount + reviewData.rating) / (product.reviewsCount + 1);
        
        await window.db.collection('products').doc(reviewData.productId).update({
            rating: newRating,
            reviewsCount: product.reviewsCount + 1
        });
        
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getProductReviews(productId) {
    try {
        const snapshot = await window.db.collection('reviews')
            .where('productId', '==', productId)
            .orderBy('createdAt', 'desc')
            .get();
        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: reviews };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

async function getSellerReviews(sellerId) {
    try {
        const snapshot = await window.db.collection('reviews')
            .where('sellerId', '==', sellerId)
            .orderBy('createdAt', 'desc')
            .get();
        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: reviews };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

// ========== 5. ТРАНЗАКЦИИ (transactions) ==========
async function createTransaction(transactionData) {
    try {
        await window.db.collection('transactions').add({
            ...transactionData,
            createdAt: new Date().toISOString()
        });
        console.log('✅ Транзакция добавлена в коллекцию transactions');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getSellerTransactions(sellerId) {
    try {
        const snapshot = await window.db.collection('transactions')
            .where('sellerId', '==', sellerId)
            .orderBy('createdAt', 'desc')
            .get();
        const transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: transactions };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

// ========== 6. ПРОМОКОДЫ (promoCodes) ==========
async function validatePromoCode(code) {
    try {
        const doc = await window.db.collection('promoCodes').doc(code.toUpperCase()).get();
        if (!doc.exists) {
            return { success: false, error: 'Промокод не найден' };
        }
        
        const promo = doc.data();
        const now = new Date();
        const expiresAt = promo.expiresAt ? new Date(promo.expiresAt) : null;
        
        if (!promo.isActive) {
            return { success: false, error: 'Промокод неактивен' };
        }
        if (expiresAt && expiresAt < now) {
            return { success: false, error: 'Срок действия промокода истёк' };
        }
        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            return { success: false, error: 'Промокод уже использован максимальное количество раз' };
        }
        
        return { success: true, data: promo };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function usePromoCode(code) {
    try {
        const promoRef = window.db.collection('promoCodes').doc(code.toUpperCase());
        const doc = await promoRef.get();
        if (!doc.exists) return { success: false, error: 'Промокод не найден' };
        
        const promo = doc.data();
        await promoRef.update({
            usedCount: (promo.usedCount || 0) + 1
        });
        console.log('✅ Промокод использован, обновлена коллекция promoCodes');
        return { success: true, discount: promo.discount };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 7. ПОДДЕРЖКА (supportMessages) ==========
async function sendSupportMessage(userId, userName, message) {
    try {
        await window.db.collection('supportMessages').add({
            userId: userId,
            userName: userName,
            message: message,
            isFromSupport: false,
            isResolved: false,
            createdAt: new Date().toISOString()
        });
        console.log('✅ Сообщение добавлено в коллекцию supportMessages');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserSupportMessages(userId) {
    try {
        const snapshot = await window.db.collection('supportMessages')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        const messages = [];
        snapshot.forEach(doc => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: messages };
    } catch (error) {
        return { success: false, error: error.message, data: [] };
    }
}

// ========== 8. ТЕСТОВЫЕ ДАННЫЕ ==========
async function initializeTestData() {
    // Проверяем, есть ли уже товары
    const productsResult = await getAllProducts();
    if (productsResult.data.length > 0) {
        console.log('Данные уже существуют');
        return;
    }
    
    console.log('Создание тестовых данных...');
    
    // Тестовые товары
    const testProducts = [
        { name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "CYBER-2077-KEY", description: "Открытый мир RPG" },
        { name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "BG3-KEY", description: "Легендарная RPG" },
        { name: "Microsoft Office 2024", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "OFFICE-KEY", description: "Офисный пакет" },
        { name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "DISCORD-KEY", description: "Подписка Discord" }
    ];
    
    for (const product of testProducts) {
        await addProduct(product);
    }
    
    // Тестовые промокоды
    const testPromoCodes = [
        { code: "WELCOME10", discount: 10, usedCount: 0, isActive: true, maxUses: 100 },
        { code: "VOLT20", discount: 20, usedCount: 0, isActive: true, maxUses: 50 },
        { code: "SALE50", discount: 50, usedCount: 0, isActive: true, maxUses: 200 }
    ];
    
    for (const promo of testPromoCodes) {
        await window.db.collection('promoCodes').doc(promo.code).set({
            discount: promo.discount,
            usedCount: promo.usedCount,
            isActive: promo.isActive,
            maxUses: promo.maxUses,
            createdAt: new Date().toISOString()
        });
    }
    
    console.log('✅ Тестовые данные созданы');
}

// ========== ЭКСПОРТ ВСЕХ ФУНКЦИЙ ==========
window.DB = {
    // Users
    createUser,
    getUser,
    updateUserBalance,
    
    // Products
    addProduct,
    getAllProducts,
    getProductsBySeller,
    updateProduct,
    deleteProduct,
    
    // Orders
    createOrder,
    getUserOrders,
    getSellerOrders,
    updateOrderStatus,
    
    // Reviews
    addReview,
    getProductReviews,
    getSellerReviews,
    
    // Transactions
    createTransaction,
    getSellerTransactions,
    
    // PromoCodes
    validatePromoCode,
    usePromoCode,
    
    // Support
    sendSupportMessage,
    getUserSupportMessages,
    
    // Init
    initializeTestData
};

console.log('✅ Firebase DB модуль загружен, все коллекции готовы');
