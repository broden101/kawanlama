// Import Firebase Modules
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

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDglb9lO6b7mMnDzOwE1i9hWGUNpwPrcKs",
    authDomain: "kawan-lama-542e6.firebaseapp.com",
    databaseURL: "https://kawan-lama-542e6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kawan-lama-542e6",
    storageBucket: "kawan-lama-542e6.appspot.com",
    messagingSenderId: "1013787942051",
    appId: "1:1013787942051:web:fa198540c5a610aa577316",
    measurementId: "G-MPX5RR24J5"
};

// Initialize Firebase App and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase Database References
const menuRef = ref(db, 'menu');
const ordersRef = ref(db, 'orders');
const historyRef = ref(db, 'history');

// Function to Save Menu Item
export function saveMenu(menuItem) {
    return push(menuRef, menuItem);
}

// Function to Update a Menu Item
export function updateMenuItem(id, updates) {
    const menuItemRef = ref(db, `menu/${id}`);
    return update(menuItemRef, updates);
}

// Function to Delete a Menu Item
export function deleteMenuItem(id) {
    const menuItemRef = ref(db, `menu/${id}`);
    return remove(menuItemRef);
}

// Listener to Retrieve and Watch Menu Items
export function listenToMenu(callback) {
    onValue(menuRef, (snapshot) => {
        const data = snapshot.val();
        const menuArray = data
            ? Object.entries(data).map(([id, value]) => ({
                id,
                ...value
            }))
            : [];
        callback(menuArray);
    });
}

// Function to Save an Order
export function saveOrder(order) {
    return push(ordersRef, order);
}

// Function to Update Order Status
export function updateOrderStatus(id, status) {
    const orderRef = ref(db, `orders/${id}`);
    return update(orderRef, { status });
}

// Listener to Retrieve and Watch Orders
export function listenToOrders(callback) {
    onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        const ordersArray = data
            ? Object.entries(data).map(([id, value]) => ({
                id,
                ...value
            }))
            : [];
        callback(ordersArray);
    });
}

// Function to Save a Transaction
export function saveTransaction(transaction) {
    return push(historyRef, transaction);
}

// Listener to Retrieve and Watch Transaction History
export function listenToHistory(callback) {
    onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        const historyArray = data
            ? Object.entries(data).map(([id, value]) => ({
                id,
                ...value
            }))
            : [];
        callback(historyArray);
    });
}
