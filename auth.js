// ==================== АВТОРИЗАЦИЯ ====================

// Ждем загрузки Firebase
function waitForFirebase() {
    if (window.auth && window.db) {
        initAuth();
    } else {
        setTimeout(waitForFirebase, 100);
    }
}

function initAuth() {
    console.log('Auth инициализирован');
    
    // Регистрация
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole') ? document.getElementById('regRole').value : 'buyer';
            const passwordConfirm = document.getElementById('regPasswordConfirm');
            
            if (passwordConfirm && password !== passwordConfirm.value) {
                alert('Пароли не совпадают');
                return;
            }
            
            // Простая проверка сложности пароля
            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            try {
                // Создаем пользователя в Firebase Auth
                const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Сохраняем данные в Firestore
                await window.db.collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    role: role,
                    createdAt: new Date().toISOString(),
                    balance: 0,
                    isActive: true
                });
                
                alert('Регистрация успешна! Теперь вы можете войти.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                if (error.code === 'auth/email-already-in-use') {
                    alert('Этот email уже зарегистрирован');
                } else if (error.code === 'auth/weak-password') {
                    alert('Пароль слишком слабый. Используйте минимум 6 символов');
                } else {
                    alert('Ошибка регистрации: ' + error.message);
                }
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
            
            try {
                const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Получаем данные пользователя
                const userDoc = await window.db.collection('users').doc(user.uid).get();
                const userData = userDoc.data();
                
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: user.uid,
                    name: userData.name,
                    email: user.email,
                    role: userData.role
                }));
                
                alert(`Добро пожаловать, ${userData.name}!`);
                
                if (userData.role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Ошибка входа:', error);
                if (error.code === 'auth/user-not-found') {
                    alert('Пользователь не найден');
                } else if (error.code === 'auth/wrong-password') {
                    alert('Неверный пароль');
                } else {
                    alert('Ошибка входа: ' + error.message);
                }
            }
        });
    }
    
    // Отслеживание состояния авторизации
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDoc = await window.db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
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
        updateUserInterface();
    });
    
    updateUserInterface();
}

// Обновление интерфейса пользователя
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
window.logout = async function() {
    await window.auth.signOut();
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};

// Переключение выпадающего меню
window.toggleUserDropdown = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
};

// Закрытие при клике вне
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    if (dropdown && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Запускаем после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    waitForFirebase();
});

// Выбор роли при регистрации
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
