// ==================== FIREBASE CONFIGURATION ====================
// Подключаем Firebase SDK
importScriptsFirebase();

function importScriptsFirebase() {
    // Загружаем Firebase скрипты динамически
    const firebaseAppScript = document.createElement('script');
    firebaseAppScript.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    firebaseAppScript.onload = function() {
        const firebaseFirestoreScript = document.createElement('script');
        firebaseFirestoreScript.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
        firebaseFirestoreScript.onload = function() {
            const firebaseAuthScript = document.createElement('script');
            firebaseAuthScript.src = 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
            firebaseAuthScript.onload = function() {
                initFirebase();
            };
            document.head.appendChild(firebaseAuthScript);
        };
        document.head.appendChild(firebaseFirestoreScript);
    };
    document.head.appendChild(firebaseAppScript);
}

function initFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyAeWBgPT84RzljctkdpGO1xtmhVd2MdD1w",
        authDomain: "diplom-57d78.firebaseapp.com",
        projectId: "diplom-57d78",
        storageBucket: "diplom-57d78.firebasestorage.app",
        messagingSenderId: "448908238147",
        appId: "1:448908238147:web:d222f715cf13a3c83d23f6",
        measurementId: "G-T6F7KWP9RR"
    };

    // Инициализируем Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    
    console.log('Firebase инициализирован');
    
    // Загружаем остальные скрипты после инициализации Firebase
    loadRemainingScripts();
}

function loadRemainingScripts() {
    const scripts = [
        'database.js',
        'auth.js',
        'cart.js',
        'chat.js',
        'main.js'
    ];
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    });
}

// Экспортируем для глобального доступа
window.firebaseConfig = {
    db: () => window.db,
    auth: () => window.auth
};
