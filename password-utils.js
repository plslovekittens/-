// ==================== ПРОВЕРКА И ХЕШИРОВАНИЕ ПАРОЛЕЙ ====================

// Хеширование пароля (имитация bcrypt)
async function hashPassword(password) {
    // Используем SHA-256 для хеширования
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Проверка пароля на утечку через Have I Been Pwned API
async function isPasswordBreached(password) {
    try {
        // Хешируем пароль SHA-1 для API
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5);
        
        // Запрос к API Have I Been Pwned
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await response.text();
        
        // Проверяем, есть ли наш суффикс в ответе
        const lines = text.split('\n');
        for (const line of lines) {
            const [foundSuffix, count] = line.split(':');
            if (foundSuffix === suffix) {
                return parseInt(count);
            }
        }
        return 0;
    } catch (error) {
        console.error('Ошибка проверки утечки пароля:', error);
        return 0;
    }
}

// Проверка сложности пароля
function validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Пароль должен содержать минимум 8 символов');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Пароль должен содержать хотя бы одну заглавную букву');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Пароль должен содержать хотя бы одну строчную букву');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Пароль должен содержать хотя бы одну цифру');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        errors.push('Пароль должен содержать хотя бы один специальный символ');
    }
    if (/(.)\1{2,}/.test(password)) {
        errors.push('Пароль не должен содержать повторяющихся символов (более 2 подряд)');
    }
    if (/(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(password)) {
        errors.push('Пароль не должен содержать последовательные цифры');
    }
    
    return { valid: errors.length === 0, errors };
}

// Проверка на распространенные пароли
const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'admin', 'welcome',
    'password123', 'admin123', 'qwerty123', '1q2w3e4r', '12345'
];

function isCommonPassword(password) {
    return commonPasswords.includes(password.toLowerCase());
}

// Получение количества попыток входа
async function getLoginAttempts(email) {
    const { db, LOGIN_ATTEMPTS_COLLECTION, collection, query, where, getDocs, doc, setDoc } = await import('./firebase-config.js');
    
    const attemptsRef = collection(db, LOGIN_ATTEMPTS_COLLECTION);
    const q = query(attemptsRef, where("email", "==", email), where("timestamp", ">", Date.now() - 15 * 60 * 1000));
    const snapshot = await getDocs(q);
    return snapshot.size;
}

// Запись неудачной попытки входа
async function recordFailedLoginAttempt(email) {
    const { db, LOGIN_ATTEMPTS_COLLECTION, collection, addDoc } = await import('./firebase-config.js');
    
    const attemptsRef = collection(db, LOGIN_ATTEMPTS_COLLECTION);
    await addDoc(attemptsRef, {
        email: email,
        timestamp: Date.now(),
        ip: await getClientIP()
    });
}

// Получение IP клиента
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return 'unknown';
    }
}

// Генерация соли
function generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Проверка пароля с хешированием
async function verifyPassword(inputPassword, storedHash, salt) {
    const hashedInput = await hashPassword(inputPassword + salt);
    return hashedInput === storedHash;
}

// Экспорт функций
window.PasswordUtils = {
    hashPassword,
    isPasswordBreached,
    validatePasswordStrength,
    isCommonPassword,
    getLoginAttempts,
    recordFailedLoginAttempt,
    verifyPassword,
    generateSalt
};
