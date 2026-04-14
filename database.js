// ==================== DATABASE WITH FIRESTORE ====================
import { 
    db, 
    PRODUCTS_COLLECTION,
    ORDERS_COLLECTION,
    REVIEWS_COLLECTION,
    TRANSACTIONS_COLLECTION,
    PROMO_CODES_COLLECTION,
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    setDoc,
    serverTimestamp
} from './firebase-config.js';

// ==================== ТОВАРЫ ====================

// Получение всех товаров
async function getAllProducts() {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const snapshot = await getDocs(productsRef);
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Ошибка получения товаров:', error);
        return [];
    }
}

// Получение товаров продавца
async function getSellerProducts(sellerId) {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const q = query(productsRef, where("sellerId", "==", sellerId));
        const snapshot = await getDocs(q);
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Ошибка получения товаров продавца:', error);
        return [];
    }
}

// Получение товара по ID
async function getProductById(productId) {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
            return { id: productSnap.id, ...productSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения товара:', error);
        return null;
    }
}

// Добавление товара (только для продавцов)
async function addProduct(product) {
    try {
        const productsRef = collection(db, PRODUCTS_COLLECTION);
        const newProduct = {
            ...product,
            createdAt: new Date().toISOString(),
            soldCount: 0,
            rating: 5.0,
            reviews: 0
        };
        const docRef = await addDoc(productsRef, newProduct);
        return { id: docRef.id, ...newProduct };
    } catch (error) {
        console.error('Ошибка добавления товара:', error);
        throw error;
    }
}

// Обновление товара
async function updateProduct(productId, updatedData) {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        await updateDoc(productRef, {
            ...updatedData,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Ошибка обновления товара:', error);
        return false;
    }
}

// Удаление товара
async function deleteProduct(productId) {
    try {
        const productRef = doc(db, PRODUCTS_COLLECTION, productId);
        await deleteDoc(productRef);
        return true;
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
        return false;
    }
}

// ==================== ЗАКАЗЫ ====================

// Создание заказа
async function createOrder(order) {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const newOrder = {
            ...order,
            status: 'paid', // Оплачено, деньги на удержании
            createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(ordersRef, newOrder);
        return { id: docRef.id, ...newOrder };
    } catch (error) {
        console.error('Ошибка создания заказа:', error);
        throw error;
    }
}

// Получение заказов покупателя
async function getUserOrders(userId) {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const q = query(ordersRef, where("buyerId", "==", userId), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error('Ошибка получения заказов:', error);
        return [];
    }
}

// Получение заказов продавца
async function getSellerOrders(sellerId) {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const q = query(ordersRef, where("sellerId", "==", sellerId), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error('Ошибка получения заказов продавца:', error);
        return [];
    }
}

// Обновление статуса заказа
async function updateOrderStatus(orderId, status) {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status: status,
            updatedAt: new Date().toISOString()
        });
        
        // Если заказ завершен, переводим деньги продавцу
        if (status === 'completed') {
            const orderSnap = await getDoc(orderRef);
            const order = orderSnap.data();
            
            const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
            await addDoc(transactionsRef, {
                sellerId: order.sellerId,
                amount: order.total,
                orderId: orderId,
                type: 'earning',
                date: new Date().toISOString()
            });
        }
        return true;
    } catch (error) {
        console.error('Ошибка обновления статуса заказа:', error);
        return false;
    }
}

// ==================== ОТЗЫВЫ ====================

// Добавление отзыва
async function addReview(review) {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);
        const newReview = {
            ...review,
            createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(reviewsRef, newReview);
        
        // Обновляем рейтинг товара
        const productRef = doc(db, PRODUCTS_COLLECTION, review.productId);
        const productSnap = await getDoc(productRef);
        const product = productSnap.data();
        const newRating = (product.rating * product.reviews + review.rating) / (product.reviews + 1);
        await updateDoc(productRef, {
            rating: newRating,
            reviews: product.reviews + 1
        });
        
        return { id: docRef.id, ...newReview };
    } catch (error) {
        console.error('Ошибка добавления отзыва:', error);
        throw error;
    }
}

// Получение отзывов о товаре
async function getProductReviews(productId) {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);
        const q = query(reviewsRef, where("productId", "==", productId));
        const snapshot = await getDocs(q);
        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        console.error('Ошибка получения отзывов:', error);
        return [];
    }
}

// Получение отзывов о продавце
async function getSellerReviews(sellerId) {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);
        const q = query(reviewsRef, where("sellerId", "==", sellerId));
        const snapshot = await getDocs(q);
        const reviews = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        return reviews;
    } catch (error) {
        console.error('Ошибка получения отзывов о продавце:', error);
        return [];
    }
}

// ==================== ТРАНЗАКЦИИ ====================

// Получение транзакций продавца
async function getSellerTransactions(sellerId) {
    try {
        const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
        const q = query(transactionsRef, where("sellerId", "==", sellerId));
        const snapshot = await getDocs(q);
        const transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        return transactions;
    } catch (error) {
        console.error('Ошибка получения транзакций:', error);
        return [];
    }
}

// ==================== ПРОМОКОДЫ ====================

// Получение промокодов пользователя
async function getUserPromoCodes(userId) {
    try {
        const promoCodesRef = collection(db, PROMO_CODES_COLLECTION);
        const q = query(promoCodesRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const promoCodes = [];
        snapshot.forEach(doc => {
            promoCodes.push({ id: doc.id, ...doc.data() });
        });
        return promoCodes;
    } catch (error) {
        console.error('Ошибка получения промокодов:', error);
        return [];
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ДАННЫХ ====================

// Загрузка начальных товаров в Firestore
async function initializeProducts() {
    const existingProducts = await getAllProducts();
    if (existingProducts.length > 0) {
        console.log('Товары уже загружены в Firestore');
        return;
    }
    
    const games = [
        { name: "Cyberpunk 2077", category: "games", price: 1990, oldPrice: 2990, discount: 33, image: "gamepad", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "CYBER-2077-KEY" },
        { name: "Baldur's Gate 3", category: "games", price: 2490, oldPrice: 3490, discount: 28, image: "dragon", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "BG3-2024-KEY" },
        { name: "Red Dead Redemption 2", category: "games", price: 2290, oldPrice: 3990, discount: 42, image: "horse", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "RDR2-GOLD-KEY" },
        { name: "Elden Ring", category: "games", price: 2790, oldPrice: 3990, discount: 30, image: "crown", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "ELDEN-RING-KEY" },
        { name: "Hogwarts Legacy", category: "games", price: 2790, oldPrice: 3990, discount: 30, image: "hat-wizard", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "HOGWARTS-KEY" },
        { name: "The Witcher 3", category: "games", price: 1490, oldPrice: 2990, discount: 50, image: "hat-wizard", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "WITCHER3-KEY" },
        { name: "Grand Theft Auto V", category: "games", price: 1490, oldPrice: 2990, discount: 50, image: "car", badge: "sale", sellerId: "admin", sellerName: "Volt Official", key: "GTA5-PREMIUM" },
        { name: "Microsoft Office 2024", category: "software", price: 3990, oldPrice: 7990, discount: 50, image: "file-alt", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "OFFICE-2024-KEY" },
        { name: "Adobe Photoshop 2024", category: "software", price: 2990, oldPrice: 5990, discount: 50, image: "paint-brush", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "PHOTOSHOP-2024" },
        { name: "Discord Nitro", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "discord", badge: "popular", sellerId: "admin", sellerName: "Volt Official", key: "DISCORD-NITRO" },
        { name: "Telegram Premium", category: "subscriptions", price: 299, oldPrice: 499, discount: 40, image: "telegram", badge: "new", sellerId: "admin", sellerName: "Volt Official", key: "TG-PREMIUM" }
    ];
    
    for (const product of games) {
        await addProduct(product);
    }
    
    console.log('Начальные товары загружены в Firestore');
}

// Экспорт функций для использования в других файлах
window.db = {
    getAllProducts,
    getSellerProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    getUserOrders,
    getSellerOrders,
    updateOrderStatus,
    addReview,
    getProductReviews,
    getSellerReviews,
    getSellerTransactions,
    getUserPromoCodes,
    initializeProducts
};
