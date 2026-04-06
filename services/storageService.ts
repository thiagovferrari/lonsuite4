/**
 * Lon Suite - Storage Service (IndexedDB)
 * Manages large binary data (attachments) without saturating LocalStorage or React state.
 */

const DB_NAME = 'LonSuiteData';
const STORE_NAME = 'attachments';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

const getDB = (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
};

/**
 * Saves attachment data to IndexedDB.
 * @param id The unique attachment ID
 * @param data The base64 string or Blob data
 */
export const saveAttachmentData = async (id: string, data: string): Promise<void> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(data, id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to save to IndexedDB:', error);
        throw error;
    }
};

/**
 * Retrieves attachment data from IndexedDB.
 * @param id The unique attachment ID
 */
export const getAttachmentData = async (id: string): Promise<string | null> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.warn(`Failed to retrieve attachment ${id} from IndexedDB:`, error);
        return null;
    }
};

/**
 * Removes attachment data from IndexedDB.
 * @param id The unique attachment ID
 */
export const deleteAttachmentData = async (id: string): Promise<void> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to delete from IndexedDB:', error);
    }
};

/**
 * Clears all data from IndexedDB.
 */
export const clearAllAttachments = async (): Promise<void> => {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Failed to clear IndexedDB:', error);
    }
};
