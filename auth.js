// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Проверка на существующего пользователя
            if (users.find(u => u.email === email)) {
                alert('Пользователь с таким email уже существует');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                role: role,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Регистрация успешна! Теперь вы можете войти.');
            window.location.href = 'login.html';
        });
    }
    
    // Вход
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                alert(`Добро пожаловать, ${user.name}!`);
                
                // Перенаправление в зависимости от роли
                if (user.role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Неверный email или пароль');
            }
        });
    }
    
    // Обновление интерфейса пользователя
    updateUserInterface();
});

// Выбор роли при регистрации
function selectRole(role) {
    document.getElementById('regRole').value = role;
    document.querySelectorAll('.role-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-role') === role) {
            opt.classList.add('selected');
        }
    });
}

// Обновление интерфейса
function updateUserInterface() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const sellerLink = document.getElementById('sellerLink');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (userName) userName.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        if (sellerLink && currentUser.role === 'seller') {
            sellerLink.style.display = 'block';
        }
    } else {
        if (authButtons) authButtons.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Выход
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Переключение выпадающего меню
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Закрытие при клике вне меню
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    if (dropdown && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});
