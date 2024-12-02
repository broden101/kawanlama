import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getDatabase,
    ref,
    push,
    set,
    onValue,
    update,
    remove 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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

// Firebase Initialization
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase References
const menuRef = ref(db, "menu");
const ordersRef = ref(db, "orders");
const historyRef = ref(db, "history");

function snapshotToArray(snapshot) {
    const data = snapshot.val();
    return data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
}

export function saveMenu(menuItem) {
    if (!menuItem.nama || !menuItem.kategori || !menuItem.harga) {
        throw new Error("Menu harus memiliki nama, kategori, dan harga.");
    }
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
    return onValue(menuRef, (snapshot) => {
        const menuItems = snapshotToArray(snapshot);
        callback(menuItems);
    });
}

export function saveOrder(order) {
    if (!order.customerName || !order.items || !Array.isArray(order.items)) {
        throw new Error("Order harus memiliki nama pelanggan dan items.");
    }
    return push(ordersRef, order);
}

export function updateOrderStatus(id, status) {
    const orderRef = ref(db, `orders/${id}`);
    return update(orderRef, { status });
}

export function listenToOrders(callback, statusFilter = null) {
    return onValue(ordersRef, (snapshot) => {
        const ordersArray = snapshotToArray(snapshot);
        const filteredOrders = statusFilter
            ? ordersArray.filter(order => order.status === statusFilter)
            : ordersArray;
        callback(filteredOrders);
    });
}

export function saveTransaction(transaction) {
    if (!transaction.items || !Array.isArray(transaction.items)) {
        throw new Error("Transaction harus memiliki items.");
    }

    transaction.items = transaction.items.map(item => ({
        name: item.nama || "Item Tidak Diketahui",
        quantity: item.quantity || 1,
        price: item.harga || 0
    }));

    return push(historyRef, transaction);
}
export function updateTransaction(transactionId, updatedData) {
    const transactionRef = ref(db, `history/${transactionId}`);
    return update(transactionRef, updatedData);
}

// In firebase.js
export function listenToHistory(callback) {
    return onValue(ref(db, 'history'), (snapshot) => {
        const data = snapshot.val();
        if (!data) return callback([]);
        
        const historyArray = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        callback(historyArray);
        
        // Update filtered transactions immediately
        if (window.filteredTransactions) {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const startDateTime = new Date(startDate + 'T00:00:00');
            const endDateTime = new Date(endDate + 'T23:59:59');
            
            window.filteredTransactions = historyArray.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDateTime && transactionDate <= endDateTime;
            });
            
            renderTransactions(window.filteredTransactions);
        }
    });
}


export function deleteTransaction(transactionId) {
    const transactionRef = ref(db, `history/${transactionId}`);
    return remove(transactionRef);
}

// Membuat objek FirebaseDB untuk expor
const FirebaseDB = {
    saveMenu,
    updateMenuItem,
    deleteMenuItem,
    listenToMenu,
    saveOrder,
    updateOrderStatus,
    listenToOrders,
    saveTransaction,
    listenToHistory,
    deleteTransaction
};

export { FirebaseDB as default };
