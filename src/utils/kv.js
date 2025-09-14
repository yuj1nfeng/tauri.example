



// storage.js
const safeJsonParse = (data) => {
    try {
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

const safeJsonStringify = (value) => {
    try {
        return JSON.stringify(value);
    } catch {
        return 'null';
    }
};

// 核心函数
const getItem = (key) => safeJsonParse(localStorage.getItem(key));

const setItem = (key) => (value) =>
    localStorage.setItem(key, safeJsonStringify(value));

const removeItem = (key) => localStorage.removeItem(key);

const clearAll = () => localStorage.clear();

const getAllKeys = () => Object.keys(localStorage);

// 函数组合工具
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const tap = (fn) => (x) => {
    fn(x);
    return x;
};

// 命名空间
const withNamespace = (namespace) => {
    const prefix = `${namespace}:`;

    return {
        get: (key) => getItem(prefix + key),
        set: (key) => (value) => setItem(prefix + key)(value),
        remove: (key) => removeItem(prefix + key),
        clear: () => getAllKeys()
            .filter(k => k.startsWith(prefix))
            .forEach(removeItem),
        keys: () => getAllKeys()
            .filter(k => k.startsWith(prefix))
            .map(k => k.slice(prefix.length))
    };
};

// 带过期时间
const withExpiry = (store) => ({
    ...store,
    setWithExpiry: (key) => (value, ttl) =>
        pipe(
            () => ({ value, expiry: Date.now() + ttl }),
            store.set(key)
        )(),
    getWithExpiry: (key) => {
        const data = store.get(key);
        if (data?.expiry && data.expiry < Date.now()) {
            store.remove(key)();
            return null;
        }
        return data?.value;
    }
});

// 导出
const storage = {
    get: getItem,
    set: setItem,
    remove: removeItem,
    clear: clearAll,
    keys: getAllKeys,
    withNamespace,
    withExpiry,
    pipe,
    tap
};

export default storage;
