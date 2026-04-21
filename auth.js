// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
window.registerUser = async function(name, email, password, role) {
    try {
        if (!window.auth) {
            throw new Error('Firebase Auth не инициализирован');
        }
        
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await window.DB.createUser(user.uid, {
            name: name,
            email: email,
            role: role
        });
        
        console.log('✅ Пользователь создан:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        return { success: false, error: error.message };
    }
};

// Вход
window.loginUser = async function(email, password) {
    try {
        if (!window.auth) {
            throw new Error('Firebase Auth не инициализирован');
        }
        
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
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
            const defaultName = user.email.split('@')[0];
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.uid,
                name: defaultName,
                email: user.email,
                role: 'buyer'
            }));
            return { success: true, userData: { name: defaultName, email: user.email, role: 'buyer' } };
        }
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        return { success: false, error: error.message };
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
if (window.auth) {
    window.auth.onAuthStateChanged(async (user) => {
        console.log('Auth state changed:', user ? user.email : 'null');
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
}

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

console.log('✅ auth.js загружен');
