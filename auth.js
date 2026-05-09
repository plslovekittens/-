// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
window.registerUser = async function(name, email, password, role) {
    try {
        if (password.length < 6) {
            return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
        }
        
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await window.db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: role,
            createdAt: new Date().toISOString(),
            balance: 0,
            isActive: true
        });
        
        console.log('✅ Пользователь создан:', user.uid);
        return { success: true, user: user };
        
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, error: 'Этот email уже зарегистрирован' };
        } else if (error.code === 'auth/weak-password') {
            return { success: false, error: 'Пароль слишком слабый (минимум 6 символов)' };
        } else if (error.code === 'auth/invalid-email') {
            return { success: false, error: 'Неверный формат email' };
        } else if (error.code === 'auth/operation-not-allowed') {
            return { success: false, error: 'Email/Password не включен в Firebase Console' };
        } else {
            return { success: false, error: error.message };
        }
    }
};

// Вход
window.loginUser = async function(email, password) {
    try {
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        const userDoc = await window.db.collection('users').doc(user.uid).get();
        const userData = userDoc.exists ? userDoc.data() : { name: user.email.split('@')[0], role: 'buyer' };
        
        sessionStorage.setItem('currentUser', JSON.stringify({
            id: user.uid,
            name: userData.name,
            email: user.email,
            role: userData.role
        }));
        
        console.log('✅ Вход выполнен:', user.uid);
        return { success: true, userData: userData };
        
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        
        if (error.code === 'auth/user-not-found') {
            return { success: false, error: 'Пользователь не найден' };
        } else if (error.code === 'auth/wrong-password') {
            return { success: false, error: 'Неверный пароль' };
        } else if (error.code === 'auth/invalid-email') {
            return { success: false, error: 'Неверный формат email' };
        } else {
            return { success: false, error: error.message };
        }
    }
};

// Выход
window.logoutUser = async function() {
    try {
        if (window.auth) await window.auth.signOut();
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
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
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            userBtn.style.width = 'auto';
            userBtn.style.padding = '0 15px';
            userBtn.style.borderRadius = '20px';
            userBtn.style.gap = '8px';
        }
        if (logoutBtn) logoutBtn.style.display = 'flex';
    } else {
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user"></i>`;
            userBtn.style.width = '40px';
            userBtn.style.padding = '0';
            userBtn.style.borderRadius = '50%';
        }
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
};

// Отслеживание состояния
window.auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDoc = await window.db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.uid,
                name: userDoc.data().name,
                email: user.email,
                role: userDoc.data().role
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
        if (opt.getAttribute('data-role') === role) opt.classList.add('selected');
    });
};
