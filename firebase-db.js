// ==================== FIREBASE FIRESTORE + LOCALSTORAGE FALLBACK ====================

// Функция ожидания Firebase
function waitForFirestore() {
    return new Promise((resolve) => {
        if (window.db) {
            resolve(true);
            return;
        }
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (window.db) {
                clearInterval(interval);
                resolve(true);
            } else if (attempts > 50) {
                clearInterval(interval);
                resolve(false);
            }
        }, 100);
    });
}

// === ПРОВЕРКА: Firebase или localStorage ===
function isFirebaseReady() {
    return window.db && typeof window.db.collection === 'function';
}

// ========== 1. ТОВАРЫ (products) ==========
async function addProduct(productData) {
    if (isFirebaseReady()) {
        try {
            const docRef = await window.db.collection('products').add({
                ...productData,
                createdAt: new Date().toISOString(),
                soldCount: 0,
                rating: 0,
                reviewsCount: 0,
                isActive: true
            });
            console.log('✅ Firebase: Товар добавлен, ID:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Firebase ошибка:', error);
            // Fallback на localStorage
            return addProductToLocalStorage(productData);
        }
    } else {
        return addProductToLocalStorage(productData);
    }
}

function addProductToLocalStorage(productData) {
    try {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const newProduct = {
            id: Date.now(),
            ...productData,
            createdAt: new Date().toISOString(),
            soldCount: 0,
            rating: 0,
            reviewsCount: 0,
            isActive: true
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        console.log('✅ localStorage: Товар добавлен, ID:', newProduct.id);
        return { success: true, id: newProduct.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getAllProducts() {
    if (isFirebaseReady()) {
        try {
            const snapshot = await window.db.collection('products').where('isActive', '==', true).get();
            const products = [];
            snapshot.forEach(doc => {
                products.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: products };
        } catch (error) {
            console.error('❌ Firebase ошибка:', error);
            return getAllProductsFromLocalStorage();
        }
    } else {
        return getAllProductsFromLocalStorage();
    }
}

function getAllProductsFromLocalStorage() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return { success: true, data: products };
}

async function getProductsBySeller(sellerId) {
    if (isFirebaseReady()) {
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
            return getProductsBySellerFromLocalStorage(sellerId);
        }
    } else {
        return getProductsBySellerFromLocalStorage(sellerId);
    }
}

function getProductsBySellerFromLocalStorage(sellerId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const filtered = products.filter(p => p.sellerId == sellerId && p.isActive !== false);
    return { success: true, data: filtered };
}

async function updateProduct(productId, updatedData) {
    if (isFirebaseReady()) {
        try {
            await window.db.collection('products').doc(productId).update({
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            return updateProductInLocalStorage(productId, updatedData);
        }
    } else {
        return updateProductInLocalStorage(productId, updatedData);
    }
}

function updateProductInLocalStorage(productId, updatedData) {
    try {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const index = products.findIndex(p => p.id == productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('products', JSON.stringify(products));
            return { success: true };
        }
        return { success: false, error: 'Товар не найден' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteProduct(productId) {
    if (isFirebaseReady()) {
        try {
            await window.db.collection('products').doc(productId).update({
                isActive: false,
                deletedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            return deleteProductFromLocalStorage(productId);
        }
    } else {
        return deleteProductFromLocalStorage(productId);
    }
}

function deleteProductFromLocalStorage(productId) {
    try {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id != productId);
        localStorage.setItem('products', JSON.stringify(products));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 2. ПОЛЬЗОВАТЕЛИ (users) ==========
async function createUser(userId, userData) {
    if (isFirebaseReady()) {
        try {
            await window.db.collection('users').doc(userId).set({
                ...userData,
                createdAt: new Date().toISOString(),
                balance: 0,
                isActive: true
            });
            return { success: true };
        } catch (error) {
            return createUserInLocalStorage(userId, userData);
        }
    } else {
        return createUserInLocalStorage(userId, userData);
    }
}

function createUserInLocalStorage(userId, userData) {
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingIndex = users.findIndex(u => u.id == userId);
        const newUser = {
            id: userId,
            ...userData,
            createdAt: new Date().toISOString(),
            balance: 0,
            isActive: true
        };
        if (existingIndex !== -1) {
            users[existingIndex] = newUser;
        } else {
            users.push(newUser);
        }
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUser(userId) {
    if (isFirebaseReady()) {
        try {
            const doc = await window.db.collection('users').doc(userId).get();
            if (doc.exists) {
                return { success: true, data: { id: doc.id, ...doc.data() } };
            }
            return { success: false, error: 'Пользователь не найден' };
        } catch (error) {
            return getUserFromLocalStorage(userId);
        }
    } else {
        return getUserFromLocalStorage(userId);
    }
}

function getUserFromLocalStorage(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id == userId);
    if (user) {
        return { success: true, data: user };
    }
    return { success: false, error: 'Пользователь не найден' };
}

// ========== 3. ЗАКАЗЫ (orders) ==========
async function createOrder(orderData) {
    if (isFirebaseReady()) {
        try {
            const docRef = await window.db.collection('orders').add({
                ...orderData,
                status: 'paid',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return createOrderInLocalStorage(orderData);
        }
    } else {
        return createOrderInLocalStorage(orderData);
    }
}

function createOrderInLocalStorage(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const newOrder = {
            id: Date.now(),
            ...orderData,
            status: 'paid',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        return { success: true, id: newOrder.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserOrders(userId) {
    if (isFirebaseReady()) {
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
            return getUserOrdersFromLocalStorage(userId);
        }
    } else {
        return getUserOrdersFromLocalStorage(userId);
    }
}

function getUserOrdersFromLocalStorage(userId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const filtered = orders.filter(o => o.buyerId == userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: filtered };
}

async function getSellerOrders(sellerId) {
    if (isFirebaseReady()) {
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
            return getSellerOrdersFromLocalStorage(sellerId);
        }
    } else {
        return getSellerOrdersFromLocalStorage(sellerId);
    }
}

function getSellerOrdersFromLocalStorage(sellerId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const filtered = orders.filter(o => o.sellerId == sellerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: filtered };
}

async function updateOrderStatus(orderId, status) {
    if (isFirebaseReady()) {
        try {
            await window.db.collection('orders').doc(orderId).update({
                status: status,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            return updateOrderStatusInLocalStorage(orderId, status);
        }
    } else {
        return updateOrderStatusInLocalStorage(orderId, status);
    }
}

function updateOrderStatusInLocalStorage(orderId, status) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const index = orders.findIndex(o => o.id == orderId);
        if (index !== -1) {
            orders[index].status = status;
            orders[index].updatedAt = new Date().toISOString();
            localStorage.setItem('orders', JSON.stringify(orders));
            return { success: true };
        }
        return { success: false, error: 'Заказ не найден' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 4. ПОДДЕРЖКА (supportMessages) ==========
async function sendSupportMessage(userId, userName, message) {
    if (isFirebaseReady()) {
        try {
            await window.db.collection('supportMessages').add({
                userId: userId,
                userName: userName,
                message: message,
                isFromSupport: false,
                isResolved: false,
                createdAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            return sendSupportMessageToLocalStorage(userId, userName, message);
        }
    } else {
        return sendSupportMessageToLocalStorage(userId, userName, message);
    }
}

function sendSupportMessageToLocalStorage(userId, userName, message) {
    try {
        const messages = JSON.parse(localStorage.getItem('supportMessages')) || [];
        messages.push({
            id: Date.now(),
            userId: userId,
            userName: userName,
            message: message,
            isFromSupport: false,
            isResolved: false,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('supportMessages', JSON.stringify(messages));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== 5. ОТЗЫВЫ (reviews) ==========
async function addReview(reviewData) {
    if (isFirebaseReady()) {
        try {
            const docRef = await window.db.collection('reviews').add({
                ...reviewData,
                createdAt: new Date().toISOString()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return addReviewToLocalStorage(reviewData);
        }
    } else {
        return addReviewToLocalStorage(reviewData);
    }
}

function addReviewToLocalStorage(reviewData) {
    try {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const newReview = {
            id: Date.now(),
            ...reviewData,
            createdAt: new Date().toISOString()
        };
        reviews.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        return { success: true, id: newReview.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getProductReviews(productId) {
    if (isFirebaseReady()) {
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
            return getProductReviewsFromLocalStorage(productId);
        }
    } else {
        return getProductReviewsFromLocalStorage(productId);
    }
}

function getProductReviewsFromLocalStorage(productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const filtered = reviews.filter(r => r.productId == productId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: filtered };
}

// ========== 6. ТРАНЗАКЦИИ (transactions) ==========
async function createTransaction(transactionData) {
    if (isFirebaseReady()) {
        try {
            await window.db.collection('transactions').add({
                ...transactionData,
                createdAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            return createTransactionInLocalStorage(transactionData);
        }
    } else {
        return createTransactionInLocalStorage(transactionData);
    }
}

function createTransactionInLocalStorage(transactionData) {
    try {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push({
            id: Date.now(),
            ...transactionData,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getSellerTransactions(sellerId) {
    if (isFirebaseReady()) {
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
            return getSellerTransactionsFromLocalStorage(sellerId);
        }
    } else {
        return getSellerTransactionsFromLocalStorage(sellerId);
    }
}

function getSellerTransactionsFromLocalStorage(sellerId) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filtered = transactions.filter(t => t.sellerId == sellerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: filtered };
}

// ========== 7. ПРОМОКОДЫ (promoCodes) ==========
async function validatePromoCode(code) {
    if (isFirebaseReady()) {
        try {
            const doc = await window.db.collection('promoCodes').doc(code.toUpperCase()).get();
            if (!doc.exists) {
                return { success: false, error: 'Промокод не найден' };
            }
            const promo = doc.data();
            const now = new Date();
            const expiresAt = promo.expiresAt ? new Date(promo.expiresAt) : null;
            
            if (!promo.isActive) return { success: false, error: 'Промокод неактивен' };
            if (expiresAt && expiresAt < now) return { success: false, error: 'Срок действия истёк' };
            if (promo.maxUses && promo.usedCount >= promo.maxUses) return { success: false, error: 'Промокод использован максимальное число раз' };
            
            return { success: true, data: promo };
        } catch (error) {
            return validatePromoCodeInLocalStorage(code);
        }
    } else {
        return validatePromoCodeInLocalStorage(code);
    }
}

function validatePromoCodeInLocalStorage(code) {
    const promoCodes = JSON.parse(localStorage.getItem('promoCodes')) || [];
    const promo = promoCodes.find(p => p.code === code.toUpperCase());
    if (!promo) return { success: false, error: 'Промокод не найден' };
    
    const now = new Date();
    const expiresAt = promo.expiresAt ? new Date(promo.expiresAt) : null;
    
    if (!promo.isActive) return { success: false, error: 'Промокод неактивен' };
    if (expiresAt && expiresAt < now) return { success: false, error: 'Срок действия истёк' };
    
    return { success: true, data: promo };
}

async function usePromoCode(code) {
    if (isFirebaseReady()) {
        try {
            const promoRef = window.db.collection('promoCodes').doc(code.toUpperCase());
            const doc = await promoRef.get();
            if (!doc.exists) return { success: false, error: 'Промокод не найден' };
            const promo = doc.data();
            await promoRef.update({ usedCount: (promo.usedCount || 0) + 1 });
            return { success: true, discount: promo.discount };
        } catch (error) {
            return usePromoCodeInLocalStorage(code);
        }
    } else {
        return usePromoCodeInLocalStorage(code);
    }
}

function usePromoCodeInLocalStorage(code) {
    try {
        const promoCodes = JSON.parse(localStorage.getItem('promoCodes')) || [];
        const index = promoCodes.findIndex(p => p.code === code.toUpperCase());
        if (index === -1) return { success: false, error: 'Промокод не найден' };
        
        promoCodes[index].usedCount = (promoCodes[index].usedCount || 0) + 1;
        localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
        return { success: true, discount: promoCodes[index].discount };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== ГЛОБАЛЬНЫЙ ОБЪЕКТ DB ==========
window.DB = {
    // Products
    addProduct,
    getAllProducts,
    getProductsBySeller,
    updateProduct,
    deleteProduct,
    
    // Users
    createUser,
    getUser,
    
    // Orders
    createOrder,
    getUserOrders,
    getSellerOrders,
    updateOrderStatus,
    
    // Support
    sendSupportMessage,
    
    // Reviews
    addReview,
    getProductReviews,
    
    // Transactions
    createTransaction,
    getSellerTransactions,
    
    // PromoCodes
    validatePromoCode,
    usePromoCode
};

console.log('✅ firebase-db.js загружен (Firebase + localStorage fallback)');
