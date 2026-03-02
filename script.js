// ==================== ДАННЫЕ ТОВАРОВ ====================

// Категории для главной страницы
const categories = [
    { id: "steam-games", name: "Игры Steam", icon: "steam", count: 30 },
    { id: "subscriptions", name: "Подписки", icon: "crown", count: 20 },
    { id: "software", name: "Программы", icon: "laptop-code", count: 20 },
    { id: "antivirus", name: "Антивирусы", icon: "shield-alt", count: 15 },
    { id: "steam-balance", name: "Пополнение Steam", icon: "wallet", count: 8 }
];

// Игры Steam (30 игр)
const steamGames = [
    {
        id: 1,
        name: "Counter-Strike 2",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 0,
        oldPrice: 0,
        discount: 0,
        rating: 4.9,
        reviews: 250000,
        image: "crosshairs",
        badge: "popular",
        platform: "Steam",
        genre: "Шутер",
        description: "Бесплатная игра. Внутриигровые предметы."
    },
    {
        id: 2,
        name: "Dota 2",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 0,
        oldPrice: 0,
        discount: 0,
        rating: 4.8,
        reviews: 180000,
        image: "chess-queen",
        badge: "popular",
        platform: "Steam",
        genre: "MOBA",
        description: "Бесплатная игра. Внутриигровые предметы."
    },
    {
        id: 3,
        name: "PUBG: BATTLEGROUNDS",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 1290,
        oldPrice: 1990,
        discount: 35,
        rating: 4.5,
        reviews: 89000,
        image: "gun",
        badge: "sale",
        platform: "Steam",
        genre: "Королевская битва",
        description: "Ключ PUBG для Steam"
    },
    {
        id: 4,
        name: "Apex Legends",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 0,
        oldPrice: 0,
        discount: 0,
        rating: 4.6,
        reviews: 67000,
        image: "bolt",
        badge: "popular",
        platform: "Steam",
        genre: "Королевская битва",
        description: "Бесплатная игра. Монеты Apex."
    },
    {
        id: 5,
        name: "Cyberpunk 2077",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 1990,
        oldPrice: 2990,
        discount: 33,
        rating: 4.5,
        reviews: 125000,
        image: "gamepad",
        badge: "sale",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Cyberpunk 2077 для Steam"
    },
    {
        id: 6,
        name: "Baldur's Gate 3",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 2490,
        oldPrice: 3490,
        discount: 28,
        rating: 5.0,
        reviews: 87600,
        image: "dragon",
        badge: "popular",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Baldur's Gate 3 для Steam"
    },
    {
        id: 7,
        name: "Red Dead Redemption 2",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 2290,
        oldPrice: 3990,
        discount: 42,
        rating: 4.9,
        reviews: 156000,
        image: "horse",
        badge: "sale",
        platform: "Steam",
        genre: "Action",
        description: "Ключ RDR2 для Steam"
    },
    {
        id: 8,
        name: "Elden Ring",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 2790,
        oldPrice: 3990,
        discount: 30,
        rating: 4.9,
        reviews: 98000,
        image: "crown",
        badge: "popular",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Elden Ring для Steam"
    },
    {
        id: 9,
        name: "Hogwarts Legacy",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 2790,
        oldPrice: 3990,
        discount: 30,
        rating: 4.8,
        reviews: 156000,
        image: "hat-wizard",
        badge: "new",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Hogwarts Legacy для Steam"
    },
    {
        id: 10,
        name: "Diablo IV",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 3490,
        oldPrice: 4990,
        discount: 30,
        rating: 4.5,
        reviews: 98000,
        image: "skull",
        badge: "new",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Diablo IV для Steam"
    },
    {
        id: 11,
        name: "Starfield",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 3490,
        oldPrice: 4990,
        discount: 30,
        rating: 4.4,
        reviews: 123000,
        image: "rocket",
        badge: "new",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Starfield для Steam"
    },
    {
        id: 12,
        name: "The Witcher 3: Wild Hunt",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 1490,
        oldPrice: 2990,
        discount: 50,
        rating: 4.9,
        reviews: 234000,
        image: "hat-wizard",
        badge: "sale",
        platform: "Steam",
        genre: "RPG",
        description: "GOTY издание с дополнениями"
    },
    {
        id: 13,
        name: "Grand Theft Auto V",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 1490,
        oldPrice: 2990,
        discount: 50,
        rating: 4.8,
        reviews: 198000,
        image: "car",
        badge: "sale",
        platform: "Steam",
        genre: "Action",
        description: "GTA V Premium Edition"
    },
    {
        id: 14,
        name: "EA Sports FC 24",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 2990,
        oldPrice: 4490,
        discount: 33,
        rating: 4.2,
        reviews: 78000,
        image: "futbol",
        badge: "sale",
        platform: "Steam",
        genre: "Спорт",
        description: "Ключ EA FC 24"
    },
    {
        id: 15,
        name: "Call of Duty: Modern Warfare III",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 3990,
        oldPrice: 5990,
        discount: 33,
        rating: 4.3,
        reviews: 89000,
        image: "gun",
        badge: "new",
        platform: "Steam",
        genre: "Шутер",
        description: "Ключ COD MW3 для Steam"
    },
    {
        id: 16,
        name: "Cities: Skylines II",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 2990,
        oldPrice: 4490,
        discount: 33,
        rating: 4.6,
        reviews: 56000,
        image: "city",
        badge: "new",
        platform: "Steam",
        genre: "Симулятор",
        description: "Ключ Cities Skylines 2"
    },
    {
        id: 17,
        name: "Microsoft Flight Simulator 2024",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 3990,
        oldPrice: 5990,
        discount: 33,
        rating: 4.7,
        reviews: 34500,
        image: "plane",
        badge: "new",
        platform: "Steam",
        genre: "Симулятор",
        description: "Ключ Flight Simulator 2024"
    },
    {
        id: 18,
        name: "S.T.A.L.K.E.R. 2",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 2990,
        oldPrice: 4490,
        discount: 33,
        rating: 4.6,
        reviews: 45000,
        image: "radiation",
        badge: "new",
        platform: "Steam",
        genre: "Шутер",
        description: "Ключ S.T.A.L.K.E.R. 2"
    },
    {
        id: 19,
        name: "Assassin's Creed Mirage",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 2490,
        oldPrice: 3990,
        discount: 37,
        rating: 4.4,
        reviews: 67000,
        image: "mask",
        badge: "sale",
        platform: "Steam",
        genre: "Action",
        description: "Ключ Assassin's Creed Mirage"
    },
    {
        id: 20,
        name: "Farming Simulator 24",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 1990,
        oldPrice: 2990,
        discount: 33,
        rating: 4.3,
        reviews: 34000,
        image: "tractor",
        badge: "sale",
        platform: "Steam",
        genre: "Симулятор",
        description: "Ключ Farming Simulator 24"
    },
    {
        id: 21,
        name: "Euro Truck Simulator 3",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 1490,
        oldPrice: 2490,
        discount: 40,
        rating: 4.7,
        reviews: 89000,
        image: "truck",
        badge: "sale",
        platform: "Steam",
        genre: "Симулятор",
        description: "Ключ ETS 3"
    },
    {
        id: 22,
        name: "Rainbow Six Siege",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 990,
        oldPrice: 1990,
        discount: 50,
        rating: 4.5,
        reviews: 156000,
        image: "user-secret",
        badge: "sale",
        platform: "Steam",
        genre: "Шутер",
        description: "Ключ R6 Siege"
    },
    {
        id: 23,
        name: "Battlefield 2042",
        category: "steam-games",
        subcategory: "sale",
        categoryName: "Игры Steam",
        price: 1490,
        oldPrice: 2990,
        discount: 50,
        rating: 4.0,
        reviews: 45000,
        image: "gun",
        badge: "sale",
        platform: "Steam",
        genre: "Шутер",
        description: "Ключ Battlefield 2042"
    },
    {
        id: 24,
        name: "ARK: Survival Ascended",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 2490,
        oldPrice: 3490,
        discount: 28,
        rating: 4.5,
        reviews: 23000,
        image: "dragon",
        badge: "new",
        platform: "Steam",
        genre: "Выживание",
        description: "Ключ ARK: Survival Ascended"
    },
    {
        id: 25,
        name: "Palworld",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 1290,
        oldPrice: 1990,
        discount: 35,
        rating: 4.7,
        reviews: 189000,
        image: "paw",
        badge: "popular",
        platform: "Steam",
        genre: "Выживание",
        description: "Ключ Palworld"
    },
    {
        id: 26,
        name: "Helldivers 2",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 2490,
        oldPrice: 2990,
        discount: 16,
        rating: 4.8,
        reviews: 134000,
        image: "gun",
        badge: "popular",
        platform: "Steam",
        genre: "Шутер",
        description: "Ключ Helldivers 2"
    },
    {
        id: 27,
        name: "Dragon's Dogma 2",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 3490,
        oldPrice: 4490,
        discount: 22,
        rating: 4.5,
        reviews: 34000,
        image: "dragon",
        badge: "new",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Dragon's Dogma 2"
    },
    {
        id: 28,
        name: "Last Epoch",
        category: "steam-games",
        subcategory: "top",
        categoryName: "Игры Steam",
        price: 1990,
        oldPrice: 2490,
        discount: 20,
        rating: 4.6,
        reviews: 43000,
        image: "skull",
        badge: "popular",
        platform: "Steam",
        genre: "RPG",
        description: "Ключ Last Epoch"
    },
    {
        id: 29,
        name: "Enshrouded",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 1990,
        oldPrice: 2490,
        discount: 20,
        rating: 4.7,
        reviews: 28000,
        image: "mountain",
        badge: "new",
        platform: "Steam",
        genre: "Выживание",
        description: "Ключ Enshrouded"
    },
    {
        id: 30,
        name: "Nightingale",
        category: "steam-games",
        subcategory: "new",
        categoryName: "Игры Steam",
        price: 1990,
        oldPrice: 2490,
        discount: 20,
        rating: 4.3,
        reviews: 12000,
        image: "feather",
        badge: "new",
        platform: "Steam",
        genre: "Выживание",
        description: "Ключ Nightingale"
    }
];

// Подписки (20 подписок)
const subscriptions = [
    {
        id: 101,
        name: "Discord Nitro Classic",
        category: "subscriptions",
        subcategory: "discord",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.8,
        reviews: 3400,
        image: "discord",
        badge: "popular",
        platform: "Discord",
        period: "1 месяц",
        description: "Discord Nitro Classic подписка"
    },
    {
        id: 102,
        name: "Discord Nitro Full",
        category: "subscriptions",
        subcategory: "discord",
        categoryName: "Подписки",
        price: 599,
        oldPrice: 999,
        discount: 40,
        rating: 4.9,
        reviews: 5600,
        image: "discord",
        badge: "popular",
        platform: "Discord",
        period: "1 месяц",
        description: "Discord Nitro полная подписка"
    },
    {
        id: 103,
        name: "Telegram Premium",
        category: "subscriptions",
        subcategory: "telegram",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.7,
        reviews: 8900,
        image: "telegram",
        badge: "new",
        platform: "Telegram",
        period: "1 месяц",
        description: "Telegram Premium подписка"
    },
    {
        id: 104,
        name: "Яндекс Музыка",
        category: "subscriptions",
        subcategory: "music",
        categoryName: "Подписки",
        price: 199,
        oldPrice: 299,
        discount: 33,
        rating: 4.6,
        reviews: 12300,
        image: "music",
        badge: "popular",
        platform: "Яндекс",
        period: "1 месяц",
        description: "Яндекс Музыка подписка"
    },
    {
        id: 105,
        name: "Яндекс Плюс",
        category: "subscriptions",
        subcategory: "music",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.7,
        reviews: 15600,
        image: "plus-circle",
        badge: "popular",
        platform: "Яндекс",
        period: "1 месяц",
        description: "Яндекс Плюс (Музыка + Кинопоиск)"
    },
    {
        id: 106,
        name: "VK Combo",
        category: "subscriptions",
        subcategory: "music",
        categoryName: "Подписки",
        price: 249,
        oldPrice: 399,
        discount: 37,
        rating: 4.5,
        reviews: 7800,
        image: "vk",
        badge: "popular",
        platform: "VK",
        period: "1 месяц",
        description: "VK Combo подписка"
    },
    {
        id: 107,
        name: "Кинопоиск HD",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.6,
        reviews: 8900,
        image: "film",
        badge: "popular",
        platform: "Кинопоиск",
        period: "1 месяц",
        description: "Кинопоиск HD подписка"
    },
    {
        id: 108,
        name: "Netflix Basic",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 699,
        oldPrice: 999,
        discount: 30,
        rating: 4.8,
        reviews: 4500,
        image: "netflix",
        badge: "new",
        platform: "Netflix",
        period: "1 месяц",
        description: "Netflix базовая подписка"
    },
    {
        id: 109,
        name: "Spotify Premium",
        category: "subscriptions",
        subcategory: "music",
        categoryName: "Подписки",
        price: 399,
        oldPrice: 699,
        discount: 42,
        rating: 4.7,
        reviews: 6700,
        image: "spotify",
        badge: "popular",
        platform: "Spotify",
        period: "1 месяц",
        description: "Spotify Premium подписка"
    },
    {
        id: 110,
        name: "Apple Music",
        category: "subscriptions",
        subcategory: "music",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.6,
        reviews: 3400,
        image: "apple",
        badge: "new",
        platform: "Apple",
        period: "1 месяц",
        description: "Apple Music подписка"
    },
    {
        id: 111,
        name: "YouTube Premium",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 399,
        oldPrice: 699,
        discount: 42,
        rating: 4.8,
        reviews: 12300,
        image: "youtube",
        badge: "popular",
        platform: "YouTube",
        period: "1 месяц",
        description: "YouTube Premium подписка"
    },
    {
        id: 112,
        name: "Twitch Turbo",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 499,
        oldPrice: 799,
        discount: 37,
        rating: 4.5,
        reviews: 2300,
        image: "twitch",
        badge: "new",
        platform: "Twitch",
        period: "1 месяц",
        description: "Twitch Turbo подписка"
    },
    {
        id: 113,
        name: "Wink Premium",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 399,
        oldPrice: 699,
        discount: 42,
        rating: 4.4,
        reviews: 1800,
        image: "tv",
        badge: "new",
        platform: "Wink",
        period: "1 месяц",
        description: "Wink Premium подписка"
    },
    {
        id: 114,
        name: "more.tv",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.3,
        reviews: 1200,
        image: "tv",
        badge: "sale",
        platform: "more.tv",
        period: "1 месяц",
        description: "more.tv подписка"
    },
    {
        id: 115,
        name: "Иви Premium",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 349,
        oldPrice: 599,
        discount: 41,
        rating: 4.5,
        reviews: 5600,
        image: "film",
        badge: "popular",
        platform: "Иви",
        period: "1 месяц",
        description: "Иви Premium подписка"
    },
    {
        id: 116,
        name: "Okko Premium",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 399,
        oldPrice: 699,
        discount: 42,
        rating: 4.5,
        reviews: 4300,
        image: "film",
        badge: "popular",
        platform: "Okko",
        period: "1 месяц",
        description: "Okko Premium подписка"
    },
    {
        id: 117,
        name: "Amediateka",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 499,
        oldPrice: 799,
        discount: 37,
        rating: 4.6,
        reviews: 3200,
        image: "film",
        badge: "popular",
        platform: "Amediateka",
        period: "1 месяц",
        description: "Amediateka подписка"
    },
    {
        id: 118,
        name: "START",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 399,
        oldPrice: 599,
        discount: 33,
        rating: 4.4,
        reviews: 2100,
        image: "film",
        badge: "new",
        platform: "START",
        period: "1 месяц",
        description: "START подписка"
    },
    {
        id: 119,
        name: "Premier",
        category: "subscriptions",
        subcategory: "video",
        categoryName: "Подписки",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.3,
        reviews: 1800,
        image: "film",
        badge: "sale",
        platform: "Premier",
        period: "1 месяц",
        description: "Premier подписка"
    },
    {
        id: 120,
        name: "VK Музыка",
        category: "subscriptions",
        subcategory: "music",
        categoryName: "Подписки",
        price: 169,
        oldPrice: 299,
        discount: 43,
        rating: 4.4,
        reviews: 8900,
        image: "music",
        badge: "popular",
        platform: "VK",
        period: "1 месяц",
        description: "VK Музыка подписка"
    }
];

// Программы (20 программ)
const software = [
    {
        id: 201,
        name: "Microsoft Office 2024 Pro",
        category: "software",
        subcategory: "office",
        categoryName: "Программы",
        price: 3990,
        oldPrice: 7990,
        discount: 50,
        rating: 4.9,
        reviews: 12500,
        image: "file-alt",
        badge: "popular",
        platform: "Windows/Mac",
        description: "Word, Excel, PowerPoint, Outlook, Access"
    },
    {
        id: 202,
        name: "Microsoft Office 2021 Pro",
        category: "software",
        subcategory: "office",
        categoryName: "Программы",
        price: 2990,
        oldPrice: 5990,
        discount: 50,
        rating: 4.8,
        reviews: 8900,
        image: "file-alt",
        badge: "sale",
        platform: "Windows/Mac",
        description: "Word, Excel, PowerPoint, Outlook"
    },
    {
        id: 203,
        name: "Microsoft Office 365",
        category: "software",
        subcategory: "office",
        categoryName: "Программы",
        price: 2490,
        oldPrice: 4990,
        discount: 50,
        rating: 4.7,
        reviews: 6700,
        image: "cloud",
        badge: "popular",
        platform: "Windows/Mac",
        period: "1 год",
        description: "Office 365 подписка на 1 год"
    },
    {
        id: 204,
        name: "Adobe Photoshop 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 2990,
        oldPrice: 5990,
        discount: 50,
        rating: 4.8,
        reviews: 3420,
        image: "paint-brush",
        badge: "popular",
        platform: "Windows/Mac",
        description: "Профессиональный редактор изображений"
    },
    {
        id: 205,
        name: "Adobe Premiere Pro 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 3490,
        oldPrice: 6990,
        discount: 50,
        rating: 4.7,
        reviews: 2800,
        image: "video",
        badge: "popular",
        platform: "Windows/Mac",
        description: "Профессиональный видеоредактор"
    },
    {
        id: 206,
        name: "Adobe Illustrator 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 2990,
        oldPrice: 5990,
        discount: 50,
        rating: 4.7,
        reviews: 2300,
        image: "pen",
        badge: "popular",
        platform: "Windows/Mac",
        description: "Векторная графика и иллюстрации"
    },
    {
        id: 207,
        name: "Adobe After Effects 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 3490,
        oldPrice: 6990,
        discount: 50,
        rating: 4.7,
        reviews: 2100,
        image: "film",
        badge: "popular",
        platform: "Windows/Mac",
        description: "Создание видеоэффектов и анимации"
    },
    {
        id: 208,
        name: "CorelDRAW Graphics Suite",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 3290,
        oldPrice: 6590,
        discount: 50,
        rating: 4.6,
        reviews: 1500,
        image: "pen",
        badge: "popular",
        platform: "Windows",
        description: "Графический дизайн и верстка"
    },
    {
        id: 209,
        name: "Visual Studio 2024 Pro",
        category: "software",
        subcategory: "development",
        categoryName: "Программы",
        price: 4490,
        oldPrice: 8990,
        discount: 50,
        rating: 4.8,
        reviews: 5600,
        image: "code",
        badge: "new",
        platform: "Windows",
        description: "Среда разработки от Microsoft"
    },
    {
        id: 210,
        name: "JetBrains IntelliJ IDEA",
        category: "software",
        subcategory: "development",
        categoryName: "Программы",
        price: 2490,
        oldPrice: 4990,
        discount: 50,
        rating: 4.9,
        reviews: 3400,
        image: "java",
        badge: "popular",
        platform: "Windows/Mac/Linux",
        description: "IDE для Java разработки"
    },
    {
        id: 211,
        name: "PyCharm Professional",
        category: "software",
        subcategory: "development",
        categoryName: "Программы",
        price: 1990,
        oldPrice: 3990,
        discount: 50,
        rating: 4.8,
        reviews: 2900,
        image: "python",
        badge: "popular",
        platform: "Windows/Mac/Linux",
        description: "IDE для Python разработки"
    },
    {
        id: 212,
        name: "VMware Workstation Pro",
        category: "software",
        subcategory: "development",
        categoryName: "Программы",
        price: 2990,
        oldPrice: 5990,
        discount: 50,
        rating: 4.7,
        reviews: 1100,
        image: "server",
        badge: "professional",
        platform: "Windows/Linux",
        description: "Виртуализация ОС"
    },
    {
        id: 213,
        name: "Microsoft Project 2024",
        category: "software",
        subcategory: "office",
        categoryName: "Программы",
        price: 2990,
        oldPrice: 5990,
        discount: 50,
        rating: 4.5,
        reviews: 800,
        image: "tasks",
        badge: "professional",
        platform: "Windows",
        description: "Управление проектами"
    },
    {
        id: 214,
        name: "MATLAB R2024",
        category: "software",
        subcategory: "development",
        categoryName: "Программы",
        price: 5990,
        oldPrice: 11990,
        discount: 50,
        rating: 4.6,
        reviews: 950,
        image: "calculator",
        badge: "professional",
        platform: "Windows/Mac/Linux",
        description: "Численные вычисления и моделирование"
    },
    {
        id: 215,
        name: "AutoCAD 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 4990,
        oldPrice: 9990,
        discount: 50,
        rating: 4.6,
        reviews: 1800,
        image: "draw-polygon",
        badge: "professional",
        platform: "Windows",
        description: "САПР для проектирования"
    },
    {
        id: 216,
        name: "3ds Max 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 5490,
        oldPrice: 10990,
        discount: 50,
        rating: 4.5,
        reviews: 1200,
        image: "cube",
        badge: "professional",
        platform: "Windows",
        description: "3D моделирование и анимация"
    },
    {
        id: 217,
        name: "SolidWorks 2024",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 6990,
        oldPrice: 13990,
        discount: 50,
        rating: 4.7,
        reviews: 800,
        image: "cubes",
        badge: "professional",
        platform: "Windows",
        description: "3D проектирование"
    },
    {
        id: 218,
        name: "DAVINCI Resolve Studio",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 2790,
        oldPrice: 5590,
        discount: 50,
        rating: 4.8,
        reviews: 1700,
        image: "video",
        badge: "popular",
        platform: "Windows/Mac/Linux",
        description: "Профессиональный видеомонтаж"
    },
    {
        id: 219,
        name: "Final Cut Pro",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 12990,
        oldPrice: 25990,
        discount: 50,
        rating: 4.9,
        reviews: 2300,
        image: "apple",
        badge: "professional",
        platform: "Mac",
        description: "Видеомонтаж для Mac"
    },
    {
        id: 220,
        name: "Logic Pro",
        category: "software",
        subcategory: "graphics",
        categoryName: "Программы",
        price: 9990,
        oldPrice: 19990,
        discount: 50,
        rating: 4.8,
        reviews: 1200,
        image: "music",
        badge: "professional",
        platform: "Mac",
        description: "Музыкальная студия для Mac"
    }
];

// Антивирусы (15 антивирусов)
const antivirus = [
    {
        id: 301,
        name: "Kaspersky Total Security",
        category: "antivirus",
        subcategory: "kaspersky",
        categoryName: "Антивирусы",
        price: 1490,
        oldPrice: 2990,
        discount: 50,
        rating: 4.9,
        reviews: 5230,
        image: "shield-alt",
        badge: "popular",
        platform: "Windows/Mac/Android",
        devices: "3 устройства",
        period: "1 год",
        description: "Комплексная защита для всех устройств"
    },
    {
        id: 302,
        name: "Kaspersky Internet Security",
        category: "antivirus",
        subcategory: "kaspersky",
        categoryName: "Антивирусы",
        price: 1190,
        oldPrice: 2390,
        discount: 50,
        rating: 4.8,
        reviews: 4300,
        image: "shield-alt",
        badge: "popular",
        platform: "Windows/Mac/Android",
        devices: "3 устройства",
        period: "1 год",
        description: "Защита от интернет-угроз"
    },
    {
        id: 303,
        name: "Kaspersky Anti-Virus",
        category: "antivirus",
        subcategory: "kaspersky",
        categoryName: "Антивирусы",
        price: 990,
        oldPrice: 1990,
        discount: 50,
        rating: 4.7,
        reviews: 3400,
        image: "shield-alt",
        badge: "sale",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Базовая антивирусная защита"
    },
    {
        id: 304,
        name: "ESET NOD32 Smart Security",
        category: "antivirus",
        subcategory: "eset",
        categoryName: "Антивирусы",
        price: 1290,
        oldPrice: 2590,
        discount: 50,
        rating: 4.8,
        reviews: 3200,
        image: "shield",
        badge: "popular",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Комплексная защита от ESET"
    },
    {
        id: 305,
        name: "ESET NOD32 Internet Security",
        category: "antivirus",
        subcategory: "eset",
        categoryName: "Антивирусы",
        price: 1590,
        oldPrice: 3190,
        discount: 50,
        rating: 4.8,
        reviews: 2800,
        image: "shield",
        badge: "popular",
        platform: "Windows",
        devices: "3 устройства",
        period: "1 год",
        description: "Защита для всей семьи"
    },
    {
        id: 306,
        name: "ESET Cyber Security Pro",
        category: "antivirus",
        subcategory: "eset",
        categoryName: "Антивирусы",
        price: 1390,
        oldPrice: 2790,
        discount: 50,
        rating: 4.7,
        reviews: 1500,
        image: "shield",
        badge: "new",
        platform: "Mac",
        devices: "1 устройство",
        period: "1 год",
        description: "Антивирус для Mac"
    },
    {
        id: 307,
        name: "Dr.Web Security Space",
        category: "antivirus",
        subcategory: "drweb",
        categoryName: "Антивирусы",
        price: 1290,
        oldPrice: 2590,
        discount: 50,
        rating: 4.7,
        reviews: 2100,
        image: "shield",
        badge: "popular",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Защита от Dr.Web"
    },
    {
        id: 308,
        name: "Dr.Web Anti-virus",
        category: "antivirus",
        subcategory: "drweb",
        categoryName: "Антивирусы",
        price: 990,
        oldPrice: 1990,
        discount: 50,
        rating: 4.6,
        reviews: 1800,
        image: "shield",
        badge: "sale",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Базовая защита Dr.Web"
    },
    {
        id: 309,
        name: "Avast Premium Security",
        category: "antivirus",
        subcategory: "avast",
        categoryName: "Антивирусы",
        price: 1190,
        oldPrice: 2390,
        discount: 50,
        rating: 4.6,
        reviews: 2900,
        image: "shield",
        badge: "popular",
        platform: "Windows/Mac",
        devices: "1 устройство",
        period: "1 год",
        description: "Премиум защита от Avast"
    },
    {
        id: 310,
        name: "AVG Internet Security",
        category: "antivirus",
        subcategory: "avg",
        categoryName: "Антивирусы",
        price: 1090,
        oldPrice: 2190,
        discount: 50,
        rating: 4.5,
        reviews: 1700,
        image: "shield",
        badge: "sale",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Защита от AVG"
    },
    {
        id: 311,
        name: "Bitdefender Total Security",
        category: "antivirus",
        subcategory: "bitdefender",
        categoryName: "Антивирусы",
        price: 1590,
        oldPrice: 3190,
        discount: 50,
        rating: 4.8,
        reviews: 1900,
        image: "shield",
        badge: "popular",
        platform: "Windows/Mac",
        devices: "3 устройства",
        period: "1 год",
        description: "Комплексная защита Bitdefender"
    },
    {
        id: 312,
        name: "Norton 360 Deluxe",
        category: "antivirus",
        subcategory: "norton",
        categoryName: "Антивирусы",
        price: 1690,
        oldPrice: 3390,
        discount: 50,
        rating: 4.7,
        reviews: 2200,
        image: "shield",
        badge: "popular",
        platform: "Windows/Mac",
        devices: "3 устройства",
        period: "1 год",
        description: "Защита Norton 360"
    },
    {
        id: 313,
        name: "McAfee Total Protection",
        category: "antivirus",
        subcategory: "mcafee",
        categoryName: "Антивирусы",
        price: 1490,
        oldPrice: 2990,
        discount: 50,
        rating: 4.5,
        reviews: 1400,
        image: "shield",
        badge: "sale",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Защита McAfee"
    },
    {
        id: 314,
        name: "Avira Prime",
        category: "antivirus",
        subcategory: "avira",
        categoryName: "Антивирусы",
        price: 1390,
        oldPrice: 2790,
        discount: 50,
        rating: 4.6,
        reviews: 1100,
        image: "shield",
        badge: "new",
        platform: "Windows/Mac",
        devices: "1 устройство",
        period: "1 год",
        description: "Премиум защита Avira"
    },
    {
        id: 315,
        name: "Panda Dome Complete",
        category: "antivirus",
        subcategory: "panda",
        categoryName: "Антивирусы",
        price: 1290,
        oldPrice: 2590,
        discount: 50,
        rating: 4.5,
        reviews: 900,
        image: "shield",
        badge: "sale",
        platform: "Windows",
        devices: "1 устройство",
        period: "1 год",
        description: "Защита Panda Dome"
    }
];

// Пополнение Steam (номиналы)
const steamBalance = [
    { amount: 100, price: 100, bonus: 0, icon: "wallet" },
    { amount: 300, price: 300, bonus: 0, icon: "wallet" },
    { amount: 500, price: 500, bonus: 0, icon: "wallet" },
    { amount: 1000, price: 980, bonus: 20, icon: "wallet" },
    { amount: 1500, price: 1470, bonus: 30, icon: "wallet" },
    { amount: 2000, price: 1950, bonus: 50, icon: "wallet" },
    { amount: 3000, price: 2910, bonus: 90, icon: "wallet" },
    { amount: 5000, price: 4850, bonus: 150, icon: "wallet" }
];

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedSteamAmount = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена, начинаем отображение товаров...');
    
    // Отображаем все категории товаров
    displayCategories();
    displaySteamGames(steamGames);
    displaySubscriptions(subscriptions);
    displaySoftware(software);
    displayAntivirus(antivirus);
    displaySteamBalance(steamBalance);
    
    // Обновляем счетчик корзины
    updateCartCount();
    
    // Отображаем товары в корзине
    displayCartItems();
    
    console.log('Отображение товаров завершено');
});

// ==================== ОТОБРАЖЕНИЕ КАТЕГОРИЙ ====================

function displayCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) {
        console.error('Элемент categoryGrid не найден');
        return;
    }
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="scrollToSection('${cat.id}')">
            <i class="fas fa-${cat.icon}"></i>
            <h3>${cat.name}</h3>
            <span>${cat.count}+ товаров</span>
        </div>
    `).join('');
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== ОТОБРАЖЕНИЕ ИГР STEAM ====================

function displaySteamGames(gamesToShow) {
    const grid = document.getElementById('steamGamesGrid');
    if (!grid) {
        console.error('Элемент steamGamesGrid не найден');
        return;
    }
    
    if (!gamesToShow || gamesToShow.length === 0) {
        grid.innerHTML = '<div class="no-products">Игры не найдены</div>';
        return;
    }
    
    grid.innerHTML = gamesToShow.map(game => `
        <div class="product-card" data-category="${game.category}">
            <div class="product-image">
                <i class="fas fa-${game.image}"></i>
                ${game.badge ? `<span class="product-badge ${game.badge}">${getBadgeText(game.badge)}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${game.name}</h3>
                <div class="product-category">
                    <i class="fas fa-tag"></i>
                    ${game.genre || game.categoryName}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(game.rating)}
                    </div>
                    <span class="reviews">(${formatNumber(game.reviews)})</span>
                </div>
                <div class="product-price">
                    ${game.price === 0 ? 
                        '<span class="current-price">Бесплатно</span>' : 
                        `<span class="current-price">${game.price} ₽</span>
                        ${game.oldPrice ? `<span class="old-price">${game.oldPrice} ₽</span>` : ''}
                        ${game.discount ? `<span class="discount-badge">-${game.discount}%</span>` : ''}`
                    }
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${game.id}, 'steam-games')">
                        <i class="fas fa-shopping-cart"></i>
                        ${game.price === 0 ? 'Получить' : 'В корзину'}
                    </button>
                    <button class="wishlist-btn" onclick="toggleWishlist(${game.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== ОТОБРАЖЕНИЕ ПОДПИСОК ====================

function displaySubscriptions(itemsToShow) {
    const grid = document.getElementById('subscriptionsGrid');
    if (!grid) {
        console.error('Элемент subscriptionsGrid не найден');
        return;
    }
    
    if (!itemsToShow || itemsToShow.length === 0) {
        grid.innerHTML = '<div class="no-products">Подписки не найдены</div>';
        return;
    }
    
    grid.innerHTML = itemsToShow.map(item => `
        <div class="product-card" data-category="${item.category}">
            <div class="product-image">
                <i class="fab fa-${item.image}"></i>
                ${item.badge ? `<span class="product-badge ${item.badge}">${getBadgeText(item.badge)}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${item.name}</h3>
                <div class="product-category">
                    <i class="fas fa-calendar"></i>
                    ${item.period || item.categoryName}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(item.rating)}
                    </div>
                    <span class="reviews">(${formatNumber(item.reviews)})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${item.price} ₽</span>
                    ${item.oldPrice ? `<span class="old-price">${item.oldPrice} ₽</span>` : ''}
                    ${item.discount ? `<span class="discount-badge">-${item.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${item.id}, 'subscriptions')">
                        <i class="fas fa-shopping-cart"></i>
                        В корзину
                    </button>
                    <button class="wishlist-btn" onclick="toggleWishlist(${item.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== ОТОБРАЖЕНИЕ ПРОГРАММ ====================

function displaySoftware(itemsToShow) {
    const grid = document.getElementById('softwareGrid');
    if (!grid) {
        console.error('Элемент softwareGrid не найден');
        return;
    }
    
    if (!itemsToShow || itemsToShow.length === 0) {
        grid.innerHTML = '<div class="no-products">Программы не найдены</div>';
        return;
    }
    
    grid.innerHTML = itemsToShow.map(item => `
        <div class="product-card" data-category="${item.category}">
            <div class="product-image">
                <i class="fas fa-${item.image}"></i>
                ${item.badge ? `<span class="product-badge ${item.badge}">${getBadgeText(item.badge)}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${item.name}</h3>
                <div class="product-category">
                    <i class="fas fa-tag"></i>
                    ${item.categoryName}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(item.rating)}
                    </div>
                    <span class="reviews">(${formatNumber(item.reviews)})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${item.price} ₽</span>
                    ${item.oldPrice ? `<span class="old-price">${item.oldPrice} ₽</span>` : ''}
                    ${item.discount ? `<span class="discount-badge">-${item.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${item.id}, 'software')">
                        <i class="fas fa-shopping-cart"></i>
                        В корзину
                    </button>
                    <button class="wishlist-btn" onclick="toggleWishlist(${item.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== ОТОБРАЖЕНИЕ АНТИВИРУСОВ ====================

function displayAntivirus(itemsToShow) {
    const grid = document.getElementById('antivirusGrid');
    if (!grid) {
        console.error('Элемент antivirusGrid не найден');
        return;
    }
    
    if (!itemsToShow || itemsToShow.length === 0) {
        grid.innerHTML = '<div class="no-products">Антивирусы не найдены</div>';
        return;
    }
    
    grid.innerHTML = itemsToShow.map(item => `
        <div class="product-card" data-category="${item.category}">
            <div class="product-image">
                <i class="fas fa-${item.image}"></i>
                ${item.badge ? `<span class="product-badge ${item.badge}">${getBadgeText(item.badge)}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${item.name}</h3>
                <div class="product-category">
                    <i class="fas fa-shield-alt"></i>
                    ${item.devices || '1 устройство'} • ${item.period || '1 год'}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(item.rating)}
                    </div>
                    <span class="reviews">(${formatNumber(item.reviews)})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${item.price} ₽</span>
                    ${item.oldPrice ? `<span class="old-price">${item.oldPrice} ₽</span>` : ''}
                    ${item.discount ? `<span class="discount-badge">-${item.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${item.id}, 'antivirus')">
                        <i class="fas fa-shopping-cart"></i>
                        В корзину
                    </button>
                    <button class="wishlist-btn" onclick="toggleWishlist(${item.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== ОТОБРАЖЕНИЕ ПОПОЛНЕНИЯ STEAM ====================

function displaySteamBalance(balances) {
    const grid = document.getElementById('steamBalanceGrid');
    if (!grid) {
        console.error('Элемент steamBalanceGrid не найден');
        return;
    }
    
    grid.innerHTML = balances.map(item => `
        <div class="balance-card" onclick="selectSteamAmount(${item.amount}, ${item.price})">
            <i class="fas fa-${item.icon}"></i>
            <div class="amount">${item.amount} ₽</div>
            <div class="price">К оплате: ${item.price} ₽</div>
            ${item.bonus > 0 ? `<div class="bonus">+${item.bonus} ₽ бонус</div>` : ''}
        </div>
    `).join('');
}

function selectSteamAmount(amount, price) {
    selectedSteamAmount = { amount, price };
    document.getElementById('selectedAmount').textContent = `${price} ₽`;
    
    // Подсвечиваем выбранную карточку
    document.querySelectorAll('.balance-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function addSteamBalanceToCart() {
    const steamLogin = document.getElementById('steamLogin').value;
    
    if (!selectedSteamAmount) {
        showNotification('Выберите сумму пополнения', 'error');
        return;
    }
    
    if (!steamLogin) {
        showNotification('Введите логин Steam', 'error');
        return;
    }
    
    const steamItem = {
        id: `steam_${Date.now()}`,
        name: `Пополнение Steam на ${selectedSteamAmount.amount} ₽`,
        category: 'steam-balance',
        categoryName: 'Пополнение Steam',
        price: selectedSteamAmount.price,
        amount: selectedSteamAmount.amount,
        image: 'steam',
        quantity: 1,
        steamLogin: steamLogin
    };
    
    addToCart(steamItem.id, 'steam-balance', steamItem);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function getBadgeText(badge) {
    const badges = {
        'popular': 'Популярное',
        'new': 'Новинка',
        'sale': 'Скидка',
        'professional': 'Профессиональное'
    };
    return badges[badge] || badge;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= Math.floor(rating) ? 
            '<i class="fas fa-star"></i>' : 
            i <= rating ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

// ==================== ФИЛЬТРАЦИЯ ====================

function filterProducts(filter, category) {
    console.log('Фильтр:', filter, 'Категория:', category);
    
    let filteredProducts = [];
    
    if (category === 'steam-games') {
        if (filter === 'all') {
            filteredProducts = steamGames;
        } else if (filter === 'top') {
            filteredProducts = steamGames.filter(g => g.subcategory === 'top');
        } else if (filter === 'new') {
            filteredProducts = steamGames.filter(g => g.subcategory === 'new');
        } else if (filter === 'sale') {
            filteredProducts = steamGames.filter(g => g.subcategory === 'sale');
        }
        displaySteamGames(filteredProducts);
    }
    
    // Обновляем активный класс кнопок
    updateActiveFilterButtons(category, filter);
}

function updateActiveFilterButtons(category, activeFilter) {
    const filterId = category === 'steam-games' ? 'gamesFilter' : 
                     category === 'subscriptions' ? 'subscriptionsFilter' :
                     category === 'software' ? 'softwareFilter' :
                     category === 'antivirus' ? 'antivirusFilter' : '';
    
    const filterContainer = document.getElementById(filterId);
    if (filterContainer) {
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            const btnFilter = btn.textContent.toLowerCase() === 'все игры' ? 'all' :
                             btn.textContent.toLowerCase() === 'все подписки' ? 'all' :
                             btn.textContent.toLowerCase() === 'все программы' ? 'all' :
                             btn.textContent.toLowerCase() === 'все антивирусы' ? 'all' :
                             btn.textContent.toLowerCase() === 'топ продаж' ? 'top' :
                             btn.textContent.toLowerCase() === 'новинки' ? 'new' :
                             btn.textContent.toLowerCase() === 'скидки' ? 'sale' : 'all';
            
            btn.classList.toggle('active', btnFilter === activeFilter);
        });
    }
}

// ==================== ПОИСК ====================

function toggleSearch() {
    document.getElementById('searchOverlay').classList.toggle('active');
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    // Ищем во всех категориях
    const allProducts = [
        ...steamGames.map(p => ({...p, source: 'steam-games'})),
        ...subscriptions.map(p => ({...p, source: 'subscriptions'})),
        ...software.map(p => ({...p, source: 'software'})),
        ...antivirus.map(p => ({...p, source: 'antivirus'}))
    ];
    
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.genre && p.genre.toLowerCase().includes(query)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(query))
    );
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.slice(0, 5).map(p => `
        <div class="search-result-item" onclick="selectSearchResult(${p.id}, '${p.source}')">
            <i class="fas fa-${p.image || 'box'}"></i>
            <div>
                <div>${p.name}</div>
                <small>${p.categoryName} • ${p.price === 0 ? 'Бесплатно' : p.price + ' ₽'}</small>
            </div>
        </div>
    `).join('');
}

function selectSearchResult(id, source) {
    closeSearch();
    
    // Прокручиваем к соответствующей секции
    const sectionMap = {
        'steam-games': 'steam-games',
        'subscriptions': 'subscriptions',
        'software': 'software',
        'antivirus': 'antivirus'
    };
    
    scrollToSection(sectionMap[source]);
}

// ==================== КОРЗИНА ====================

function addToCart(productId, category, customItem = null) {
    let product = customItem;
    
    if (!customItem) {
        // Ищем товар в соответствующей категории
        if (category === 'steam-games') {
            product = steamGames.find(p => p.id === productId);
        } else if (category === 'subscriptions') {
            product = subscriptions.find(p => p.id === productId);
        } else if (category === 'software') {
            product = software.find(p => p.id === productId);
        } else if (category === 'antivirus') {
            product = antivirus.find(p => p.id === productId);
        }
    }
    
    if (!product) {
        console.error('Товар не найден');
        return;
    }
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || 'box',
        category: product.categoryName,
        quantity: 1,
        ...(customItem || {})
    };
    
    const existingItem = cart.find(item => item.id === cartItem.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    saveCart();
    updateCartCount();
    displayCartItems();
    
    // Анимация корзины
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
    
    showNotification('Товар добавлен в корзину');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
    showNotification('Товар удален из корзины');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCartItems();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function displayCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Корзина пуста</p></div>';
        totalElement.textContent = '0 ₽';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas fa-${item.image}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price * item.quantity} ₽</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = `${total} ₽`;
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

// ==================== ОПЛАТА ====================

function showPaymentModal() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const modal = document.getElementById('sbpModal');
    const orderId = 'VOLT-' + Date.now().toString().slice(-8);
    
    document.getElementById('sbpAmount').textContent = total + ' ₽';
    document.getElementById('sbpOrderId').textContent = orderId;
    
    modal.classList.add('active');
}

function confirmPayment() {
    showNotification('Спасибо за покупку! Товары будут отправлены на ваш email.', 'success');
    
    // Очищаем корзину
    cart = [];
    saveCart();
    updateCartCount();
    displayCartItems();
    closeModal();
}

function closeModal() {
    document.getElementById('sbpModal').classList.remove('active');
    document.getElementById('helpModal').classList.remove('active');
}

// ==================== УВЕДОМЛЕНИЯ ====================

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ==================== ПОМОЩЬ ====================

function showHelp(topic) {
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    const helpContent = {
        'howtobuy': {
            title: 'Как купить',
            content: `
                <h4>Процесс покупки:</h4>
                <ol>
                    <li>Выберите товар и добавьте его в корзину</li>
                    <li>Перейдите в корзину и нажмите "Оплатить через СБП"</li>
                    <li>Отсканируйте QR-код или оплатите по ссылке</li>
                    <li>После оплаты товар будет отправлен на ваш email</li>
                </ol>
                <p>Для пополнения Steam укажите ваш логин или ссылку на профиль.</p>
            `
        },
        'payment': {
            title: 'Оплата через СБП',
            content: `
                <h4>Оплата через СБП:</h4>
                <ul>
                    <li>Мгновенное зачисление</li>
                    <li>Без комиссии</li>
                    <li>Поддерживаются все банки РФ</li>
                    <li>Оплата по QR-коду или ссылке</li>
                </ul>
            `
        },
        'delivery': {
            title: 'Доставка',
            content: `
                <h4>Доставка товаров:</h4>
                <ul>
                    <li>Ключи Steam отправляются мгновенно</li>
                    <li>Подписки активируются в течение 5 минут</li>
                    <li>Программы и антивирусы приходят на email</li>
                    <li>Пополнение Steam зачисляется автоматически</li>
                </ul>
            `
        },
        'activation': {
            title: 'Активация Steam',
            content: `
                <h4>Как активировать ключ в Steam:</h4>
                <ol>
                    <li>Откройте клиент Steam</li>
                    <li>В меню выберите "Игры" → "Активировать через Steam"</li>
                    <li>Примите лицензионное соглашение</li>
                    <li>Введите полученный ключ</li>
                </ol>
            `
        }
    };
    
    const content = helpContent[topic] || helpContent['howtobuy'];
    title.textContent = content.title;
    body.innerHTML = content.content;
    
    modal.classList.add('active');
}

// ==================== ИЗБРАННОЕ ====================

function toggleWishlist(productId) {
    showNotification('Товар добавлен в избранное');
}

// ==================== ЗАКРЫТИЕ МОДАЛОК ПО ESC ====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearch();
        closeModal();
        if (document.getElementById('cartSidebar').classList.contains('active')) {
            toggleCart();
        }
    }
});

// ==================== ПРОВЕРКА ССЫЛОК ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ссылки на соцсети:');
    console.log('Telegram:', document.querySelector('a[href*="t.me"]')?.href);
    console.log('Discord:', document.querySelector('a[href*="discord"]')?.href);
    console.log('VK:', document.querySelector('a[href*="vk.com"]')?.href);
});
