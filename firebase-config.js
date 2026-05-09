// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyAeWBgPT84RzljctkdpGO1xtmhVd2MdD1w",
    authDomain: "diplom-57d78.firebaseapp.com",
    projectId: "diplom-57d78",
    storageBucket: "diplom-57d78.firebasestorage.app",
    messagingSenderId: "448908238147",
    appId: "1:448908238147:web:d222f715cf13a3c83d23f6",
    measurementId: "G-T6F7KWP9RR"
};

// Инициализация Firebase
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        console.log('✅ Firebase инициализирован');
        console.log('✅ window.auth:', !!window.auth);
        console.log('✅ window.db:', !!window.db);
    } else {
        console.error('❌ Firebase SDK не загружен! Проверьте подключение скриптов.');
    }
} catch (error) {
    console.error('❌ Ошибка инициализации Firebase:', error);
}
