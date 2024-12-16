import axios from '../api/api';

class OfflineReportSync {
    constructor() {
        this.dbName = 'DumpwatchDB';
        this.storeName = 'pendingReports';
        this.db = null;
    }

    // Enhanced DB initialization with detailed logging
    async initDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.error('IndexedDB is not supported in this browser');
                return reject(new Error('IndexedDB not supported'));
            }

            const request = indexedDB.open(this.dbName,4); 

            request.onupgradeneeded = (event) => {
                try {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName, { 
                            keyPath: 'id', 
                            autoIncrement: true 
                        });
                        console.log('[IndexedDB] Created object store:', this.storeName);
                    }
                } catch (err) {
                    console.error('[IndexedDB] Upgrade error:', err);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('[IndexedDB] Database opened successfully');
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('[IndexedDB] Database open error:', event.target.error);
                reject(new Error(`Failed to open IndexedDB: ${event.target.error}`));
            };
        });
    }

    // Enhanced method to add pending report with detailed logging
    async addPendingReport(reportData) {
        try {
            if (!this.db) await this.initDB();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                
                // Add timestamp to help with debugging and ordering
                const reportWithTimestamp = {
                    ...reportData,
                    createdAt: new Date().toISOString()
                };

                const request = store.add(reportWithTimestamp);

                request.onsuccess = (event) => {
                    console.log('[IndexedDB] Report saved offline:', event.target.result);
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    console.error('[IndexedDB] Failed to save report:', event.target.error);
                    console.error('[IndexedDB] Report data:', reportWithTimestamp);
                    
                    // Log additional context about the database
                    console.log('[IndexedDB] Database details:', {
                        name: this.db.name,
                        version: this.db.version,
                        objectStoreNames: Array.from(this.db.objectStoreNames)
                    });

                    reject(new Error(`Failed to save report: ${event.target.error}`));
                };

                // Add transaction error handling
                transaction.onerror = (event) => {
                    console.error('[IndexedDB] Transaction error:', event.target.error);
                };
            });
        } catch (error) {
            console.error('[IndexedDB] Unexpected error in addPendingReport:', error);
            throw error;
        }
    }

    // Enhanced sync method with more robust error handling and logging
    async syncPendingReports() {
        if (!this.db) await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const cursorRequest = store.openCursor();

            const reportsToSync = [];

            cursorRequest.onsuccess = async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    reportsToSync.push(cursor.value);
                    cursor.continue();
                } else {
                    // Sort reports by creation time to ensure correct order
                    reportsToSync.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                    console.log(`[IndexedDB] Preparing to sync ${reportsToSync.length} reports`);

                    try {
                        for (const report of reportsToSync) {
                            console.log('[IndexedDB] Attempting to sync report:', report.id);
                            await this.uploadReport(report);
                            
                            // Remove synced report from IndexedDB
                            const deleteRequest = store.delete(report.id);
                            deleteRequest.onsuccess = () => {
                                console.log(`[IndexedDB] Removed synced report ${report.id}`);
                            };
                            deleteRequest.onerror = (event) => {
                                console.error(`[IndexedDB] Failed to remove report ${report.id}:`, event.target.error);
                            }
                        }
                        resolve(reportsToSync.length);
                    } catch (error) {
                        console.error('[IndexedDB] Sync failed:', error);
                        reject(error);
                    }
                }
            };

            cursorRequest.onerror = (event) => {
                console.error('[IndexedDB] Cursor error:', event.target.error);
                reject(new Error('Error retrieving pending reports'));
            };
        });
    }

    // Enhanced upload method with more logging
    async uploadReport(report) {
        const formData = new FormData();
        Object.keys(report).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
                formData.append(key, report[key]);
            }
        });

        try {
            console.log('[IndexedDB] Uploading report:', report);
            const response = await axios.post('/create-report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('[IndexedDB] Report upload successful:', response.data);
        } catch (error) {
            console.error('Sync failed for report:', error.response ? error.response.data : error);
            throw error;
        }
    }

    // Comprehensive sync check method
    async checkAndSync() {
        console.log('[IndexedDB] Checking for sync. Online status:', navigator.onLine);
        
        if (navigator.onLine) {
            try {
                const syncedCount = await this.syncPendingReports();
                console.log(`[IndexedDB] Sync complete. Reports synced: ${syncedCount}`);
                
                if (syncedCount > 0) {
                    return `Synced ${syncedCount} pending report(s)`;
                }
            } catch (error) {
                console.error('[IndexedDB] Sync error:', error);
                return 'Failed to sync pending reports';
            }
        }
        return null;
    }
}

// Create a singleton instance
const offlineReportSync = new OfflineReportSync();

// Add online/offline event listeners with enhanced logging
window.addEventListener('online', async () => {
    console.log('[Network] Online event triggered');
    const syncResult = await offlineReportSync.checkAndSync();
    if (syncResult) {
        console.log('[Network] Sync result:', syncResult);
        alert(syncResult);
    }
});

window.addEventListener('offline', () => {
    console.log('[Network] Offline event triggered');
});

export default offlineReportSync;