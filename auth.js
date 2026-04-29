// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация (localStorage версия)
window.registerUser = function(name, email, password, role) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.find(u => u.email === email)) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
    }
    
    if (password.length < 6) {
        return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
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
    
    return { success: true, user: newUser };
};

// Вход
window.loginUser = function(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, error: 'Неверный email или пароль' };
    }
    
    sessionStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }));
    
    return { success: true, userData: user };
};

// Выход
window.logoutUser = function() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};

// Получение текущего пользователя
window.getCurrentUser = function() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

// Обновление интерфейса
window.updateUserInterface = function() {
    const currentUser = window.getCurrentUser();
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
};

// Обработчики форм
document.addEventListener('DOMContentLoaded', function() {
    window.updateUserInterface();
    
    // Регистрация
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm');
            
            if (passwordConfirm && password !== passwordConfirm.value) {
                alert('Пароли не совпадают');
                return;
            }
            
            const result = window.registerUser(name, email, password, role);
            if (result.success) {
                alert('Регистрация успешна! Теперь вы можете войти.');
                window.location.href = 'login.html';
            } else {
                alert('Ошибка: ' + result.error);
            }
        });
    }
    
    // Вход
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = window.loginUser(email, password);
            if (result.success) {
                alert(`Добро пожаловать, ${result.userData.name}!`);
                if (result.userData.role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Ошибка: ' + result.error);
            }
        });
    }
});

// Глобальные функции
window.logout = window.logoutUser;

window.toggleUserDropdown = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('show');
};

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    if (dropdown && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

window.selectRole = function(role) {
    const roleInput = document.getElementById('regRole');
    if (roleInput) roleInput.value = role;
    
    document.querySelectorAll('.role-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-role') === role) {
            opt.classList.add('selected');
        }
    });
};
