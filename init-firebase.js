// ==================== ИНИЦИАЛИЗАЦИЯ КОЛЛЕКЦИЙ FIRESTORE ====================

// Функция для создания всех коллекций и тестовых данных
async function initializeFirestoreCollections() {
    console.log('🚀 Начинаем инициализацию коллекций Firestore...');
    
    try {
        // 1. СОЗДАНИЕ ТЕСТОВЫХ ПОЛЬЗОВАТЕЛЕЙ
        console.log('📝 Создаём тестовых пользователей...');
        
        // Продавец
        const sellerId = 'seller_demo_001';
        await window.db.collection('users').doc(sellerId).set({
            name: 'Дмитрий Продавец',
            email: 'seller@volt.com',
            role: 'seller',
            createdAt: new Date().toISOString(),
            balance: 15000,
            isActive: true,
            phone: '+79991234567'
        });
        console.log('✅ Продавец создан');
        
        // Покупатель
        const buyerId = 'buyer_demo_001';
        await window.db.collection('users').doc(buyerId).set({
            name: 'Алексей Покупатель',
            email: 'buyer@volt.com',
            role: 'buyer',
            createdAt: new Date().toISOString(),
            balance: 5000,
            isActive: true,
            phone: '+79997654321'
        });
        console.log('✅ Покупатель создан');
        
        // Администратор
        const adminId = 'admin_demo_001';
        await window.db.collection('users').doc(adminId).set({
            name: 'Администратор',
            email: 'admin@volt.com',
            role: 'admin',
            createdAt: new Date().toISOString(),
            isActive: true
        });
        console.log('✅ Администратор создан');
        
        // 2. СОЗДАНИЕ ТОВАРОВ
        console.log('📦 Создаём товары...');
        
        const products = [
            {
                name: 'Cyberpunk 2077',
                description: 'Открытый мир RPG от CD Projekt Red. Будущее, киберпанк, свобода выбора.',
                category: 'games',
                price: 1990,
                oldPrice: 2990,
                discount: 33,
                image: 'gamepad',
                badge: 'sale',
                key: 'CYBER-2077-XXXX-YYYY',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.5,
                reviewsCount: 1250,
                soldCount: 45,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Baldur\'s Gate 3',
                description: 'Легендарная RPG, игра года 2023. Огромный мир, множество классов и рас.',
                category: 'games',
                price: 2490,
                oldPrice: 3490,
                discount: 28,
                image: 'dragon',
                badge: 'new',
                key: 'BG3-2024-XXXX-YYYY',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 5.0,
                reviewsCount: 8760,
                soldCount: 128,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Microsoft Office 2024 Pro',
                description: 'Word, Excel, PowerPoint, Outlook, Access. Лицензия на 1 ПК.',
                category: 'software',
                price: 3990,
                oldPrice: 7990,
                discount: 50,
                image: 'file-alt',
                badge: 'popular',
                key: 'OFFICE-2024-XXXX-YYYY',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.8,
                reviewsCount: 3420,
                soldCount: 89,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Adobe Photoshop 2024',
                description: 'Профессиональный редактор изображений. Нейросети, генеративная заливка.',
                category: 'software',
                price: 2990,
                oldPrice: 5990,
                discount: 50,
                image: 'paint-brush',
                badge: 'popular',
                key: 'PHOTOSHOP-2024-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.7,
                reviewsCount: 2300,
                soldCount: 56,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Discord Nitro',
                description: 'Улучшенный Discord: анимированные аватарки, эмодзи, стриминг в 4K',
                category: 'subscriptions',
                price: 299,
                oldPrice: 499,
                discount: 40,
                image: 'discord',
                badge: 'popular',
                key: 'DISCORD-NITRO-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.9,
                reviewsCount: 5600,
                soldCount: 234,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Telegram Premium',
                description: 'Telegram Premium: увеличенные лимиты, стикеры, реакции',
                category: 'subscriptions',
                price: 299,
                oldPrice: 499,
                discount: 40,
                image: 'telegram',
                badge: 'new',
                key: 'TG-PREMIUM-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.7,
                reviewsCount: 8900,
                soldCount: 312,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'The Witcher 3: Wild Hunt',
                description: 'Полное издание со всеми дополнениями. Одна из лучших RPG всех времён.',
                category: 'games',
                price: 1490,
                oldPrice: 2990,
                discount: 50,
                image: 'hat-wizard',
                badge: 'sale',
                key: 'WITCHER3-GOTY-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.9,
                reviewsCount: 23400,
                soldCount: 567,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Windows 11 Pro',
                description: 'Оригинальная лицензия Windows 11 Pro. Пожизненная активация.',
                category: 'software',
                price: 3990,
                oldPrice: 8990,
                discount: 55,
                image: 'windows',
                badge: 'sale',
                key: 'WIN11-PRO-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.8,
                reviewsCount: 3100,
                soldCount: 145,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'YouTube Premium',
                description: 'YouTube Premium: просмотр без рекламы, фоновая загрузка',
                category: 'subscriptions',
                price: 399,
                oldPrice: 699,
                discount: 42,
                image: 'youtube',
                badge: 'popular',
                key: 'YT-PREMIUM-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.6,
                reviewsCount: 4300,
                soldCount: 178,
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                name: 'Netflix Basic',
                description: 'Netflix Basic: доступ ко всем фильмам и сериалам в HD качестве',
                category: 'subscriptions',
                price: 699,
                oldPrice: 999,
                discount: 30,
                image: 'netflix',
                badge: 'new',
                key: 'NETFLIX-BASIC-XXXX',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                rating: 4.5,
                reviewsCount: 2100,
                soldCount: 89,
                createdAt: new Date().toISOString(),
                isActive: true
            }
        ];
        
        for (const product of products) {
            await window.db.collection('products').add(product);
        }
        console.log(`✅ Создано ${products.length} товаров`);
        
        // 3. СОЗДАНИЕ ТЕСТОВЫХ ЗАКАЗОВ
        console.log('📋 Создаём тестовые заказы...');
        
        const orders = [
            {
                buyerId: buyerId,
                buyerName: 'Алексей Покупатель',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                productId: '', // ID будет получен после создания товаров
                productName: 'Cyberpunk 2077',
                quantity: 1,
                price: 1990,
                total: 1990,
                productKey: 'CYBER-2077-XXXX-YYYY',
                status: 'completed',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                buyerId: buyerId,
                buyerName: 'Алексей Покупатель',
                sellerId: sellerId,
                sellerName: 'Дмитрий Продавец',
                productId: '',
                productName: 'Discord Nitro',
                quantity: 2,
                price: 299,
                total: 598,
                productKey: 'DISCORD-NITRO-XXXX',
                status: 'paid',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        for (const order of orders) {
            await window.db.collection('orders').add(order);
        }
        console.log(`✅ Создано ${orders.length} заказов`);
        
        // 4. СОЗДАНИЕ ПРОМОКОДОВ
        console.log('🎁 Создаём промокоды...');
        
        const promoCodes = [
            {
                code: 'WELCOME10',
                discount: 10,
                expiresAt: new Date('2026-12-31T23:59:59Z'),
                maxUses: 100,
                usedCount: 0,
                isActive: true
            },
            {
                code: 'VOLT20',
                discount: 20,
                expiresAt: new Date('2026-06-30T23:59:59Z'),
                maxUses: 50,
                usedCount: 0,
                isActive: true
            },
            {
                code: 'SALE50',
                discount: 50,
                expiresAt: new Date('2026-05-31T23:59:59Z'),
                maxUses: 200,
                usedCount: 0,
                isActive: true
            }
        ];
        
        for (const promo of promoCodes) {
            await window.db.collection('promoCodes').doc(promo.code).set(promo);
        }
        console.log(`✅ Создано ${promoCodes.length} промокодов`);
        
        // 5. СОЗДАНИЕ ТРАНЗАКЦИЙ
        console.log('💰 Создаём транзакции...');
        
        const transactions = [
            {
                sellerId: sellerId,
                amount: 1990,
                type: 'earning',
                status: 'completed',
                createdAt: new Date().toISOString()
            },
            {
                sellerId: sellerId,
                amount: 598,
                type: 'earning',
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        ];
        
        for (const transaction of transactions) {
            await window.db.collection('transactions').add(transaction);
        }
        console.log(`✅ Создано ${transactions.length} транзакций`);
        
        console.log('🎉 ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА! Все коллекции созданы.');
        
        // Обновляем глобальный массив товаров
        if (typeof loadProducts === 'function') {
            await loadProducts();
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Ошибка при инициализации:', error);
        return false;
    }
}

// Функция для проверки, инициализирована ли база данных
async function isDatabaseInitialized() {
    try {
        const snapshot = await window.db.collection('products').limit(1).get();
        return !snapshot.empty;
    } catch (error) {
        return false;
    }
}

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Ждём инициализации Firebase
    const checkFirebase = setInterval(async () => {
        if (window.db) {
            clearInterval(checkFirebase);
            
            const isInit = await isDatabaseInitialized();
            if (!isInit) {
                console.log('База данных пуста, запускаем инициализацию...');
                await initializeFirestoreCollections();
            } else {
                console.log('База данных уже содержит данные');
            }
        }
    }, 500);
});

// Экспортируем функцию для ручного вызова (через консоль)
window.initFirestore = initializeFirestoreCollections;
