const VERSION = 1;

export function openDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, VERSION);

        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = e => resolve(e.target.result);
        request.onerror = e => reject(e.target.error);
    });
}

export async function addItem(data, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.add(data);

        req.onsuccess = () => resolve(req.result); // trả về id mới
        req.onerror = e => reject(e.target.error);
    });
}

export async function getItem(id, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result);
        req.onerror = e => reject(e.target.error);
    });
}

export async function getAllItems(dbName, storeName) {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result);
        req.onerror = e => reject(e.target.error);
    });
}

export async function updateItem(data, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(data); // cần data có id

        req.onsuccess = () => resolve(true);
        req.onerror = e => reject(e.target.error);
    });
}

// Xóa item
export async function deleteItem(id, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.delete(id);

        req.onsuccess = () => resolve(true);
        req.onerror = e => reject(e.target.error);
    });
}
export function deleteDatabase(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);

        request.onsuccess = () => resolve(true);
        request.onerror = e => reject(e.target.error);
        request.onblocked = () =>
            console.warn("Delete blocked. Close all tabs using this DB.");
    });
}
export async function clearAllItems(dbName, storeName) {
    const db = await openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.clear();

        req.onsuccess = () => resolve(true);
        req.onerror = e => reject(e.target.error);
    });
}
export async function addManyItems(items, dbName, storeName) {
    if (!Array.isArray(items)) {
        throw new Error("addManyItems expects an array");
    }

    const db = await openDB(dbName, storeName);

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);

        const insertedIds = [];

        items.forEach(item => {
            const req = store.add(item);
            req.onsuccess = () => insertedIds.push(req.result);
            req.onerror = e => reject(e.target.error);
        });

        tx.oncomplete = () => resolve(insertedIds);
        tx.onerror = e => reject(e.target.error);
    });
}