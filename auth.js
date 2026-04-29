// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
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
    const userBtn = document.querySelector('.user-btn');
    
    if (currentUser) {
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            userBtn.style.width = 'auto';
            userBtn.style.padding = '0 15px';
            userBtn.style.borderRadius = '20px';
            userBtn.style.gap = '8px';
        }
    } else {
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user"></i>`;
            userBtn.style.width = '40px';
            userBtn.style.padding = '0';
            userBtn.style.borderRadius = '50%';
        }
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
                // ПЕРЕНАПРАВЛЕНИЕ В ЗАВИСИМОСТИ ОТ РОЛИ
                if (result.userData.role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    window.location.href = 'profile.html';
                }
            } else {
                alert('Ошибка: ' + result.error);
            }
        });
    }
});

window.logout = window.logoutUser;
