// ==================== РАБОТА С FIRESTORE ====================

// Добавление товара
async function addProductToFirestore(productData) {
    try {
        const docRef = await window.db.collection('products').add({
            ...productData,
            createdAt: new Date().toISOString(),
            soldCount: 0,
            rating: 0,
            reviewsCount: 0,
            isActive: true
        });
        console.log('✅ Товар добавлен в Firestore, ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Ошибка добавления:', error);
        return { success: false, error: error.message };
    }
}

// Получение всех товаров
async function getAllProductsFromFirestore() {
    try {
        const snapshot = await window.db.collection('products').where('isActive', '==', true).get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: products };
    } catch (error) {
        console.error('❌ Ошибка получения товаров:', error);
        return { success: false, error: error.message, data: [] };
    }
}

// Получение товаров продавца
async function getSellerProductsFromFirestore(sellerId) {
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

// Обновление товара
async function updateProductInFirestore(productId, updatedData) {
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

// Удаление товара (мягкое удаление)
async function deleteProductFromFirestore(productId) {
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

// Создание пользователя
async function createUserInFirestore(userId, userData) {
    try {
        await window.db.collection('users').doc(userId).set({
            ...userData,
            createdAt: new Date().toISOString(),
            balance: 0,
            isActive: true
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Получение пользователя
async function getUserFromFirestore(userId) {
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
async function createOrderInFirestore(orderData) {
    try {
        const docRef = await window.db.collection('orders').add({
            ...orderData,
            status: 'paid',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Получение заказов пользователя
async function getUserOrdersFromFirestore(userId) {
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
async function getSellerOrdersFromFirestore(sellerId) {
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

// Обновление статуса заказа
async function updateOrderStatusInFirestore(orderId, status) {
    try {
        await window.db.collection('orders').doc(orderId).update({
            status: status,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Глобальный объект DB
window.DB = {
    addProduct: addProductToFirestore,
    getAllProducts: getAllProductsFromFirestore,
    getSellerProducts: getSellerProductsFromFirestore,
    updateProduct: updateProductInFirestore,
    deleteProduct: deleteProductFromFirestore,
    createUser: createUserInFirestore,
    getUser: getUserFromFirestore,
    createOrder: createOrderInFirestore,
    getUserOrders: getUserOrdersFromFirestore,
    getSellerOrders: getSellerOrdersFromFirestore,
    updateOrderStatus: updateOrderStatusInFirestore
};

console.log('✅ Firebase DB модуль загружен');
