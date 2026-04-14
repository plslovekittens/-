// ==================== АВТОРИЗАЦИЯ С ПРОВЕРКОЙ БЕЗОПАСНОСТИ ====================
import { 
    auth,
    db,
    USERS_COLLECTION,
    doc,
    setDoc,
    getDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from './firebase-config.js';

// Импортируем утилиты для паролей
const script = document.createElement('script');
script.src = './password-utils.js';
document.head.appendChild(script);

// Функция регистрации с проверкой безопасности
async function registerUser(name, email, password, role) {
    // 1. Проверка сложности пароля
    const strengthCheck = window.PasswordUtils.validatePasswordStrength(password);
    if (!strengthCheck.valid) {
        throw new Error(strengthCheck.errors.join('\n'));
    }
    
    // 2. Проверка на распространенный пароль
    if (window.PasswordUtils.isCommonPassword(password)) {
        throw new Error('Этот пароль слишком распространенный. Пожалуйста, выберите более надежный пароль.');
    }
    
    // 3. Проверка на утечку данных
    const breachCount = await window.PasswordUtils.isPasswordBreached(password);
    if (breachCount > 0) {
        throw new Error(`Этот пароль был обнаружен в ${breachCount} утечках данных. Пожалуйста, выберите другой пароль.`);
    }
    
    // 4. Создание пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 5. Хешируем пароль с солью для дополнительного хранения
    const salt = window.PasswordUtils.generateSalt();
    const hashedPassword = await window.PasswordUtils.hashPassword(password + salt);
    
    // 6. Сохраняем данные в Firestore
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
        name: name,
        email: email,
        role: role,
        passwordHash: hashedPassword,
        passwordSalt: salt,
        createdAt: new Date().toISOString(),
        lastPasswordChange: new Date().toISOString(),
        balance: 0,
        isActive: true,
        loginAttempts: 0,
        lastLogin: null
    });
    
    return user;
}

// Функция входа с проверкой блокировки
async function loginUser(email, password) {
    // 1. Проверяем количество неудачных попыток
    const attempts = await window.PasswordUtils.getLoginAttempts(email);
    if (attempts >= 5) {
        throw new Error('Слишком много неудачных попыток. Попробуйте через 15 минут.');
    }
    
    try {
        // 2. Пытаемся войти
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 3. Получаем данные пользователя
        const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
        const userData = userDoc.data();
        
        // 4. Проверяем, активен ли аккаунт
        if (!userData.isActive) {
            throw new Error('Ваш аккаунт заблокирован. Обратитесь в поддержку.');
        }
        
        // 5. Обновляем информацию о входе
        await setDoc(doc(db, USERS_COLLECTION, user.uid), {
            lastLogin: new Date().toISOString(),
            loginAttempts: 0
        }, { merge: true });
        
        // 6. Сохраняем в сессию
        sessionStorage.setItem('currentUser', JSON.stringify({
            id: user.uid,
            name: userData.name,
            email: user.email,
            role: userData.role
        }));
        
        return { user, userData };
        
    } catch (error) {
        // Записываем неудачную попытку
        await window.PasswordUtils.recordFailedLoginAttempt(email);
        
        if (error.code === 'auth/user-not-found') {
            throw new Error('Пользователь с таким email не найден');
        } else if (error.code === 'auth/wrong-password') {
            throw new Error('Неверный пароль');
        } else {
            throw new Error(error.message);
        }
    }
}

// Функция сброса пароля
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        throw new Error('Ошибка отправки письма для сброса пароля');
    }
}

// Функция смены пароля (требует старый пароль)
async function changePassword(user, oldPassword, newPassword) {
    // 1. Проверка нового пароля
    const strengthCheck = window.PasswordUtils.validatePasswordStrength(newPassword);
    if (!strengthCheck.valid) {
        throw new Error(strengthCheck.errors.join('\n'));
    }
    
    // 2. Проверка на утечку
    const breachCount = await window.PasswordUtils.isPasswordBreached(newPassword);
    if (breachCount > 0) {
        throw new Error(`Этот пароль был обнаружен в утечках данных. Пожалуйста, выберите другой.`);
    }
    
    // 3. Проверка, что новый пароль отличается от старого
    if (oldPassword === newPassword) {
        throw new Error('Новый пароль должен отличаться от старого');
    }
    
    // 4. Обновляем пароль в Firebase Auth
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    
    // 5. Обновляем хеш в Firestore
    const salt = window.PasswordUtils.generateSalt();
    const hashedPassword = await window.PasswordUtils.hashPassword(newPassword + salt);
    
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
        passwordHash: hashedPassword,
        passwordSalt: salt,
        lastPasswordChange: new Date().toISOString()
    }, { merge: true });
    
    return true;
}

// Регистрация обработчиков форм
document.addEventListener('DOMContentLoaded', function() {
    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm')?.value;
            
            // Проверка совпадения паролей
            if (passwordConfirm && password !== passwordConfirm) {
                alert('Пароли не совпадают');
                return;
            }
            
            try {
                await registerUser(name, email, password, role);
                alert('Регистрация успешна! Теперь вы можете войти.');
                window.location.href = 'login.html';
            } catch (error) {
                alert('Ошибка регистрации:\n' + error.message);
            }
        });
    }
    
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const { userData } = await loginUser(email, password);
                alert(`Добро пожаловать, ${userData.name}!`);
                
                if (userData.role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                alert('Ошибка входа:\n' + error.message);
            }
        });
    }
    
    // Сброс пароля
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            
            try {
                await resetPassword(email);
                alert('Письмо для сброса пароля отправлено на ваш email');
            } catch (error) {
                alert('Ошибка: ' + error.message);
            }
        });
    }
    
    // Проверка состояния авторизации
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
            if (userDoc.exists()) {
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
window.logout = async function() {
    await signOut(auth);
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

// Закрытие меню при клике вне
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    if (dropdown && userBtn && !userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Показать форму сброса пароля
window.showResetPassword = function() {
    const modal = document.createElement('div');
    modal.className = 'reset-modal';
    modal.innerHTML = `
        <div class="reset-modal-content">
            <h3>Сброс пароля</h3>
            <p>Введите email, указанный при регистрации</p>
            <input type="email" id="resetEmail" placeholder="Email">
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-primary" onclick="submitResetPassword()">Отправить</button>
                <button class="btn btn-secondary" onclick="this.closest('.reset-modal').remove()">Отмена</button>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .reset-modal { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:10000; }
        .reset-modal-content { background:#1e293b; padding:30px; border-radius:16px; width:90%; max-width:400px; text-align:center; }
        .reset-modal-content input { width:100%; padding:12px; margin-top:15px; background:#0f172a; border:1px solid #334155; border-radius:8px; color:white; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
};

window.submitResetPassword = async function() {
    const email = document.getElementById('resetEmail').value;
    if (!email) {
        alert('Введите email');
        return;
    }
    
    try {
        await resetPassword(email);
        alert('Письмо для сброса пароля отправлено на ваш email');
        document.querySelector('.reset-modal').remove();
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
};
