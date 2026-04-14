// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
function registerUser(name, email, password, role) {
    return window.auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return window.db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: role,
                createdAt: new Date().toISOString(),
                balance: 0
            }).then(() => user);
        });
}

// Вход
function loginUser(email, password) {
    return window.auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return window.db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    const userData = doc.data();
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        id: user.uid,
                        name: userData.name,
                        email: user.email,
                        role: userData.role
                    }));
                    return userData;
                });
        });
}

// Выход
function logoutUser() {
    return window.auth.signOut().then(() => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Получение текущего пользователя
function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Обновление интерфейса
function updateUserInterface() {
    const currentUser = getCurrentUser();
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

// Отслеживание состояния авторизации
window.auth.onAuthStateChanged((user) => {
    if (user) {
        window.db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: user.uid,
                    name: userData.name,
                    email: user.email,
                    role: userData.role
                }));
                updateUserInterface();
            }
        });
    } else {
        sessionStorage.removeItem('currentUser');
        updateUserInterface();
    }
});

// Обработчики форм
document.addEventListener('DOMContentLoaded', function() {
    updateUserInterface();
    
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
            
            registerUser(name, email, password, role)
                .then(() => {
                    alert('Регистрация успешна! Теперь вы можете войти.');
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert('Этот email уже зарегистрирован');
                    } else if (error.code === 'auth/weak-password') {
                        alert('Пароль должен содержать минимум 6 символов');
                    } else {
                        alert('Ошибка: ' + error.message);
                    }
                });
        });
    }
    
    // Вход
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            loginUser(email, password)
                .then((userData) => {
                    alert(`Добро пожаловать, ${userData.name}!`);
                    if (userData.role === 'seller') {
                        window.location.href = 'seller-dashboard.html';
                    } else {
                        window.location.href = 'profile.html';
                    }
                })
                .catch((error) => {
                    if (error.code === 'auth/user-not-found') {
                        alert('Пользователь не найден');
                    } else if (error.code === 'auth/wrong-password') {
                        alert('Неверный пароль');
                    } else {
                        alert('Ошибка: ' + error.message);
                    }
                });
        });
    }
});

// Глобальные функции
window.logout = logoutUser;
window.getCurrentUser = getCurrentUser;

window.toggleUserDropdown = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
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
