// ==================== АВТОРИЗАЦИЯ ====================

window.registerUser = async function(name, email, password, role) {
    try {
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
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
        console.error('Ошибка регистрации:', error);
        return { success: false, error: error.message };
    }
};

window.loginUser = async function(email, password) {
    try {
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

window.logoutUser = async function() {
    try {
        await window.auth.signOut();
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};

window.getCurrentUser = function() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

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

window.logout = window.logoutUser;

console.log('auth.js загружен');
