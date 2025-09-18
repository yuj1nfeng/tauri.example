const db_version = 1;
export default (db_name = 'db_name', options = { keyPath: 'id', autoIncrement: true }) => {
    const store_name = 'data';
    let db = null;
    const open = () =>
        new Promise((resolve, reject) => {
            const request = indexedDB.open(db_name, db_version);
            request.onupgradeneeded = (e) => {
                e.target.result.createObjectStore(store_name, options);
            };
            request.onsuccess = (e) => {
                db = e.target.result;
                resolve();
            };
            request.onerror = (e) => reject(e.target.error);
        });

    const getStore = (mode = 'readwrite') => {
        if (!db) throw new Error('Database not initialized');
        if (db.objectStoreNames.contains(store_name)) return db.transaction(store_name, mode).objectStore(store_name);
        db.createObjectStore(store_name, options);
        return db.transaction(store_name, mode).objectStore(store_name);
    };
    const promisifyRequest = (request) =>
        new Promise((resolve, reject) => {
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });

    return {
        async init() {
            await open();
            return this;
        },

        // 添加数据
        async add(item) {
            const store = getStore();
            const value = { ...item };
            console.log('add', value);
            const request = store.add(value);
            // const request = store.add({ value: item, key: key || item.id || item.key });
            const result = await promisifyRequest(request);
            return result;
        },
        // 列出所有数据
        async getAll() {
            const store = getStore('readonly');
            const request = store.getAll();
            const result = await promisifyRequest(request);
            const items = result || [];
            return items;
        },

        async get(id) {
            const store = getStore('readonly');
            const request = store.get(id);
            const result = await promisifyRequest(request);
            return result;
        },
        async update(key, value) {
            const store = getStore('readwrite');
            let result = await promisifyRequest(store.get(key));
            const new_value = { ...result, ...value };
            result = await promisifyRequest(store.put(new_value));
            return result;
        },
        async delete(key) {
            const store = getStore('readwrite');
            const request = store.delete(key);
            const result = await promisifyRequest(request);
            return result;
        },
        async clear() {
            const store = getStore('readwrite');
            const request = store.clear();
            const result = await promisifyRequest(request);
            return result;
        },
    };
};
