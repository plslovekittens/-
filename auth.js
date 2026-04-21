// ==================== АВТОРИЗАЦИЯ ====================

// Регистрация
window.registerUser = async function(name, email, password, role) {
    try {
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (window.DB && window.DB.createUser) {
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
        } else {
            await window.db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: role,
                createdAt: new Date().toISOString(),
                balance: 0,
                isActive: true
            });
            return { success: true, user };
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, error: error.message };
    }
};

// Вход
window.loginUser = async function(email, password) {
    try {
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        let userData = null;
        
        if (window.DB && window.DB.getUser) {
            const result = await window.DB.getUser(user.uid);
            if (result.success) {
                userData = result.data;
            }
        } else {
            const userDoc = await window.db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                userData = userDoc.data();
            }
        }
        
        if (userData) {
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.uid,
                name: userData.name,
                email: user.email,
                role: userData.role
            }));
            return { success: true, userData };
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: user.uid,
                name: user.email.split('@')[0],
                email: user.email,
                role: 'buyer'
            }));
            return { success: true, userData: { name: user.email.split('@')[0], email: user.email, role: 'buyer' } };
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, error: error.message };
    }
};

// Выход
window.logoutUser = async function() {
    try {
        await window.auth.signOut();
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
window.auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            let userData = null;
            if (window.DB && window.DB.getUser) {
                const result = await window.DB.getUser(user.uid);
                if (result.success) {
                    userData = result.data;
                }
            } else {
                const userDoc = await window.db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    userData = userDoc.data();
                }
            }
            
            if (userData) {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: user.uid,
                    name: userData.name,
                    email: user.email,
                    role: userData.role
                }));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify({
                    id: user.uid,
                    name: user.email.split('@')[0],
                    email: user.email,
                    role: 'buyer'
                }));
            }
        } catch (error) {
            console.error('Ошибка получения данных пользователя:', error);
        }
    } else {
        sessionStorage.removeItem('currentUser');
    }
    window.updateUserInterface();
});

// Глобальные функции
window.logout = window.logoutUser;

console.log('auth.js загружен');
