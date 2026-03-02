// Данные товаров
const products = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        category: "games",
        categoryName: "Игры",
        price: 1990,
        oldPrice: 2990,
        discount: 33,
        rating: 4.5,
        reviews: 1250,
        image: "gamepad",
        badge: "popular",
        platform: "PC"
    },
    {
        id: 2,
        name: "Adobe Photoshop 2024",
        category: "software",
        categoryName: "Программы",
        price: 2990,
        oldPrice: 5990,
        discount: 50,
        rating: 4.8,
        reviews: 3420,
        image: "laptop-code",
        badge: "new"
    },
    {
        id: 3,
        name: "Kaspersky Total Security",
        category: "antivirus",
        categoryName: "Антивирусы",
        price: 1490,
        oldPrice: 2990,
        discount: 50,
        rating: 4.9,
        reviews: 5230,
        image: "shield-alt",
        badge: "popular"
    },
    {
        id: 4,
        name: "Windows 11 Pro",
        category: "software",
        categoryName: "ОС",
        price: 3990,
        oldPrice: 8990,
        discount: 55,
        rating: 4.7,
        reviews: 2180,
        image: "windows",
        badge: "sale"
    },
    {
        id: 5,
        name: "Baldur's Gate 3",
        category: "games",
        categoryName: "Игры",
        price: 2490,
        oldPrice: 3490,
        discount: 28,
        rating: 5.0,
        reviews: 8760,
        image: "gamepad",
        badge: "new"
    },
    {
        id: 6,
        name: "Microsoft Office 2024",
        category: "software",
        categoryName: "Программы",
        price: 3490,
        oldPrice: 6990,
        discount: 50,
        rating: 4.8,
        reviews: 4520,
        image: "file-alt",
        badge: "popular"
    }
];

// Категории
const categories = [
    { id: "games", name: "Игры", icon: "gamepad", count: 1250 },
    { id: "software", name: "Программы", icon: "laptop-code", count: 850 },
    { id: "antivirus", name: "Антивирусы", icon: "shield-alt", count: 150 },
    { id: "os", name: "ОС", icon: "windows", count: 45 }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
    displayProducts(products);
    updateCartCount();
    displayCartItems();
});

// Отображение категорий
function displayCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterProducts('${cat.id}')">
            <i class="fas fa-${cat.icon}"></i>
            <h3>${cat.name}</h3>
            <span>${cat.count}+ товаров</span>
        </div>
    `).join('');
}

// Отображение товаров
function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<div class="no-products">Товары не найдены</div>';
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas fa-${product.image}"></i>
                ${product.badge ? `<span class="product-badge ${product.badge}">${getBadgeText(product.badge)}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">
                    <i class="fas fa-tag"></i>
                    ${product.categoryName}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="reviews">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                    ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        В корзину
                    </button>
                    <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Вспомогательные функции
function getBadgeText(badge) {
    const badges = {
        'popular': 'Популярное',
        'new': 'Новинка',
        'sale': 'Скидка'
    };
    return badges[badge] || badge;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? 
            '<i class="fas fa-star"></i>' : 
            '<i class="far fa-star"></i>';
    }
    return stars;
}

// Фильтрация
function filterProducts(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    displayProducts(filtered);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', 
            btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent === 'Все'));
    });
}

// Поиск
function toggleSearch() {
    document.getElementById('searchOverlay').classList.toggle('active');
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchResults').innerHTML = '';
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.categoryName.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="no-results">Ничего не найдено</div>';
        return;
    }
    
    results.innerHTML = filtered.map(p => `
        <div class="search-result-item" onclick="selectProduct(${p.id})">
            <i class="fas fa-${p.image}"></i>
            <div>
                <div>${p.name}</div>
                <small>${p.categoryName} • ${p.price} ₽</small>
            </div>
        </div>
    `).join('');
}

function selectProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        closeSearch();
        alert(`Выбран товар: ${product.name}`);
    }
}

// Корзина
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    displayCartItems();
    
    // Анимация кнопки корзины
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
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
        container.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
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
                <div class="cart-item-price">${item.price} ₽</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
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

function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Спасибо за покупку!\nСумма заказа: ${total} ₽\nТовары будут отправлены на ваш email.`);
    
    // Очистка корзины
    cart = [];
    saveCart();
    updateCartCount();
    displayCartItems();
    toggleCart();
}

// Избранное
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    alert(`${product.name} добавлен в избранное!`);
}

// Закрытие корзины по клику вне её
document.addEventListener('click', (e) => {
    const cart = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cart.classList.contains('active') && 
        !cart.contains(e.target) && 
        !cartBtn.contains(e.target)) {
        toggleCart();
    }
});

// Закрытие поиска по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearch();
        if (document.getElementById('cartSidebar').classList.contains('active')) {
            toggleCart();
        }
    }
});
