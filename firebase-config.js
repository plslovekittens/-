// ==================== FIREBASE CONFIGURATION ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    getDocs, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    setDoc,
    serverTimestamp,
    increment
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeWBgPT84RzljctkdpGO1xtmhVd2MdD1w",
    authDomain: "diplom-57d78.firebaseapp.com",
    projectId: "diplom-57d78",
    storageBucket: "diplom-57d78.firebasestorage.app",
    messagingSenderId: "448908238147",
    appId: "1:448908238147:web:d222f715cf13a3c83d23f6",
    measurementId: "G-T6F7KWP9RR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Коллекции
const USERS_COLLECTION = 'users';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const REVIEWS_COLLECTION = 'reviews';
const TRANSACTIONS_COLLECTION = 'transactions';
const PROMO_CODES_COLLECTION = 'promoCodes';
const SUPPORT_MESSAGES_COLLECTION = 'supportMessages';
const LOGIN_ATTEMPTS_COLLECTION = 'loginAttempts';

export { 
    db, 
    auth,
    USERS_COLLECTION,
    PRODUCTS_COLLECTION,
    ORDERS_COLLECTION,
    REVIEWS_COLLECTION,
    TRANSACTIONS_COLLECTION,
    PROMO_CODES_COLLECTION,
    SUPPORT_MESSAGES_COLLECTION,
    LOGIN_ATTEMPTS_COLLECTION,
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    setDoc,
    serverTimestamp,
    increment,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
};
