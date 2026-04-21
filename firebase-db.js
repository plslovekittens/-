// ==================== ВСЕ ОПЕРАЦИИ С FIRESTORE ====================

// Добавление товара
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
        console.log('✅ Товар добавлен, ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Ошибка добавления товара:', error);
        return { success: false, error: error.message };
    }
}

// Получение всех товаров
async function getAllProducts() {
    try {
        const snapshot = await window.db.collection('products').where('isActive', '==', true).get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: products };
    } catch (error) {
        console.error('Ошибка получения товаров:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Получение товаров продавца
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

// Создание пользователя
async function createUser(userId, userData) {
    try {
        await window.db.collection('users').doc(userId).set({
            ...userData,
            createdAt: new Date().toISOString(),
            balance: 0,
            isActive: true
        });
        console.log('✅ Пользователь создан:', userId);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Получение пользователя
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

// Создание заказа
async function createOrder(orderData) {
    try {
        const docRef = await window.db.collection('orders').add({
            ...orderData,
            status: 'paid',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Заказ создан:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Получение заказов пользователя
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

// Получение заказов продавца
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

// Глобальный объект DB
window.DB = {
    addProduct,
    getAllProducts,
    getProductsBySeller,
    createUser,
    getUser,
    createOrder,
    getUserOrders,
    getSellerOrders
};

console.log('✅ Firebase DB модуль загружен');
