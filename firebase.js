// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push,
    set,
    onValue,
    update,
    remove 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration (gunakan config dari Firebase console Anda)
const firebaseConfig = {
    apiKey: "AIzaSyDglb9lO6b7mMnDzOwE1i9hWGUNpwPrcKs",
    authDomain: "kawan-lama-542e6.firebaseapp.com",
    databaseURL: "https://kawan-lama-542e6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kawan-lama-542e6",
    storageBucket: "kawan-lama-542e6.firebasestorage.app",
    messagingSenderId: "1013787942051",
    appId: "1:1013787942051:web:fa198540c5a610aa577316",
    measurementId: "G-MPX5RR24J5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export fungsi-fungsi untuk digunakan di file HTML
export function saveMenu(menuItem) {
    const menuRef = ref(db, 'menu');
    return push(menuRef, menuItem);
}

export function updateMenuItem(id, updates) {
    const menuItemRef = ref(db, `menu/${id}`);
    return update(menuItemRef, updates);
}

export function deleteMenuItem(id) {
    const menuItemRef = ref(db, `menu/${id}`);
    return remove(menuItemRef);
}

export function listenToMenu(callback) {
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        const menuArray = data ? Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        })) : [];
        callback(menuArray);
    });
}

export function saveOrder(order) {
    const ordersRef = ref(db, 'orders');
    return push(ordersRef, {
        ...order,
        timestamp: Date.now()
    });
}

export function updateOrderStatus(id, status) {
    const orderRef = ref(db, `orders/${id}`);
    return update(orderRef, { status });
}

export function saveTransaction(transaction) {
    const historyRef = ref(db, 'history');
    return push(historyRef, {
        ...transaction,
        timestamp: Date.now()
    });
}
