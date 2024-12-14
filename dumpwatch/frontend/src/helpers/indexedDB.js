export const openDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2); // Increment version number for schema changes
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
            }
        };
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

export const addToDB = (dbName, storeName, data) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            
            // Add timestamp to help with sync and ordering
            const dataWithTimestamp = {
                ...data,
                timestamp: new Date().getTime(),
                status: 'pending'
            };
            
            const addRequest = store.add(dataWithTimestamp);
            
            addRequest.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            addRequest.onerror = (event) => {
                reject(event.target.error);
            };
            
            tx.oncomplete = () => {
                db.close();
            };
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

export const getAllFromDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = (event) => {
                const data = event.target.result || [];
                // Sort by timestamp to ensure correct order
                const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);
                resolve(sortedData);
            };
            
            getAllRequest.onerror = (event) => {
                reject(event.target.error);
            };
            
            tx.oncomplete = () => {
                db.close();
            };
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

export const deleteFromDB = (dbName, storeName, id) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            
            const deleteRequest = store.delete(id);
            
            deleteRequest.onsuccess = () => {
                resolve();
            };
            
            deleteRequest.onerror = (event) => {
                reject(event.target.error);
            };
            
            tx.oncomplete = () => {
                db.close();
            };
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

export const updateDBItemStatus = (dbName, storeName, id, status) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 2);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            
            const getRequest = store.get(id);
            
            getRequest.onsuccess = (event) => {
                const data = event.target.result;
                if (data) {
                    data.status = status;
                    const updateRequest = store.put(data);
                    
                    updateRequest.onsuccess = () => {
                        resolve();
                    };
                    
                    updateRequest.onerror = (event) => {
                        reject(event.target.error);
                    };
                } else {
                    reject(new Error('Item not found'));
                }
            };
            
            getRequest.onerror = (event) => {
                reject(event.target.error);
            };
            
            tx.oncomplete = () => {
                db.close();
            };
        };
        
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};