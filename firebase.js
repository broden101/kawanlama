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

// Initialize Firebase
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
    return push(menuRef, menuItem)
        .then(() => console.log("Menu berhasil disimpan:", menuItem))
        .catch((error) => console.error("Error menyimpan menu:", error.message));
}

export function updateMenuItem(id, updates) {
    const menuItemRef = ref(db, `menu/${id}`);
    return update(menuItemRef, updates)
        .then(() => console.log("Menu berhasil diperbarui:", updates))
        .catch((error) => console.error("Error memperbarui menu:", error.message));
}

export function deleteMenuItem(id) {
    const menuItemRef = ref(db, `menu/${id}`);
    return remove(menuItemRef)
        .then(() => console.log("Menu berhasil dihapus:", id))
        .catch((error) => console.error("Error menghapus menu:", error.message));
}

export function listenToMenu(callback) {
    onValue(menuRef, (snapshot) => callback(snapshotToArray(snapshot)));
}

export function saveOrder(order) {
    if (!order.customerName || !order.items || !Array.isArray(order.items)) {
        throw new Error("Order harus memiliki nama pelanggan dan items.");
    }
    return push(ordersRef, order)
        .then(() => console.log("Order berhasil disimpan:", order))
        .catch((error) => console.error("Error menyimpan order:", error.message));
}

export function updateOrderStatus(id, status) {
    const orderRef = ref(db, `orders/${id}`);
    return update(orderRef, { status })
        .then(() => console.log("Order status berhasil diperbarui:", status))
        .catch((error) => console.error("Error memperbarui status order:", error.message));
}

export function listenToOrders(callback, statusFilter = null) {
    onValue(ordersRef, (snapshot) => {
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

    // Pastikan setiap item memiliki nama dan harga
    transaction.items = transaction.items.map(item => ({
        name: item.nama || "Item Tidak Diketahui",
        quantity: item.quantity || 1,
        price: item.harga || 0
    }));

    return push(historyRef, transaction)
        .then(() => console.log("Transaction berhasil disimpan:", transaction))
        .catch((error) => console.error("Error menyimpan transaksi:", error.message));
}


export function listenToHistory(callback) {
    onValue(historyRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Raw data from Firebase (history):", data); // Debugging log
        const historyArray = data
            ? Object.entries(data).map(([id, value]) => ({
                  id,
                  ...value
              }))
            : [];
        console.log("Processed history array:", historyArray); // Debugging log
        callback(historyArray);
    });
}

