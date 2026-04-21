// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
window.registerUser = async function(name, email, password, role) {
    try {
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Используем DB функцию для создания пользователя
        const result = await window.DB.createUser(user.uid, {
            name: name,
            email: email,
            role: role
        });
        
        if (result.success) {
            return { success: true, user };
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Вход
window.loginUser = async function(email, password) {
    try {
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Используем DB функцию для получения данных пользователя
        const result = await window.DB.getUser(user.uid);
        
        if (result.success) {
            const userData = result.data;
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.uid,
                name: userData.name,
                email: user.email,
                role: userData.role
            }));
            return { success: true, userData };
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Выход
window.logoutUser = async function() {
    await window.auth.signOut();
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

// Отслеживание состояния авторизации
window.auth.onAuthStateChanged(async (user) => {
    if (user) {
        const result = await window.DB.getUser(user.uid);
        if (result.success) {
            const userData = result.data;
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.uid,
                name: userData.name,
                email: user.email,
                role: userData.role
            }));
        }
    } else {
        sessionStorage.removeItem('currentUser');
    }
    window.updateUserInterface();
});

// Обработчики форм
document.addEventListener('DOMContentLoaded', function() {
    window.updateUserInterface();
    
    // Регистрация
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
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
            
            const result = await window.registerUser(name, email, password, role);
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
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await window.loginUser(email, password);
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
