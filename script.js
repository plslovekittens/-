// Простой тестовый код для проверки отображения игр

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена');
    
    // Простые тестовые данные
    const testGames = [
        {
            id: 1,
            name: "Counter-Strike 2",
            price: 0,
            image: "crosshairs",
            badge: "popular"
        },
        {
            id: 2,
            name: "Dota 2",
            price: 0,
            image: "chess-queen",
            badge: "popular"
        },
        {
            id: 3,
            name: "Cyberpunk 2077",
            price: 1990,
            oldPrice: 2990,
            discount: 33,
            image: "gamepad",
            badge: "sale"
        },
        {
            id: 4,
            name: "Baldur's Gate 3",
            price: 2490,
            image: "dragon",
            badge: "new"
        }
    ];
    
    // Отображаем игры
    const grid = document.getElementById('steamGamesGrid');
    if (grid) {
        console.log('Найден элемент steamGamesGrid');
        
        let html = '';
        for (let game of testGames) {
            html += `
                <div class="product-card">
                    <div class="product-image">
                        <i class="fas fa-${game.image}"></i>
                        ${game.badge ? `<span class="product-badge ${game.badge}">${game.badge}</span>` : ''}
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${game.name}</h3>
                        <div class="product-price">
                            ${game.price === 0 ? 
                                '<span class="current-price">Бесплатно</span>' : 
                                `<span class="current-price">${game.price} ₽</span>
                                ${game.oldPrice ? `<span class="old-price">${game.oldPrice} ₽</span>` : ''}
                                ${game.discount ? `<span class="discount-badge">-${game.discount}%</span>` : ''}`
                            }
                        </div>
                        <div class="product-actions">
                            <button class="add-to-cart" onclick="alert('Добавлено в корзину')">
                                <i class="fas fa-shopping-cart"></i>
                                В корзину
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        grid.innerHTML = html;
        console.log('Игры отображены');
    } else {
        console.error('Элемент steamGamesGrid НЕ НАЙДЕН!');
    }
    
    // Обновляем счетчик корзины
    document.getElementById('cartCount').textContent = '0';
    
    // Отображаем категории
    const catGrid = document.getElementById('categoryGrid');
    if (catGrid) {
        catGrid.innerHTML = `
            <div class="category-card">
                <i class="fas fa-steam"></i>
                <h3>Игры Steam</h3>
                <span>30+ игр</span>
            </div>
            <div class="category-card">
                <i class="fas fa-crown"></i>
                <h3>Подписки</h3>
                <span>20+ сервисов</span>
            </div>
            <div class="category-card">
                <i class="fas fa-laptop-code"></i>
                <h3>Программы</h3>
                <span>20+ программ</span>
            </div>
            <div class="category-card">
                <i class="fas fa-shield-alt"></i>
                <h3>Антивирусы</h3>
                <span>15+ антивирусов</span>
            </div>
        `;
    }
});

// Простые функции для работы интерфейса
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function toggleSearch() {
    document.getElementById('searchOverlay').classList.toggle('active');
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
}

function showNotification(msg) {
    alert(msg);
}
