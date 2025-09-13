function push(key, item) {
    const v = localStorage.getItem(key);
    const arr = [];
    if (v) {
        try {
            const parsed_value = JSON.parse(v);
            Array.isArray(parsed_value) && arr.push(parsed_value);
        } catch (error) {}
    }
    arr.push(item);
    set(arr);
}

function set(key, value) {
    const v = JSON.stringify(value);
    setStr(key, v);
}

function get(key) {
    const v = getStr(key);
    return !!v ? JSON.parse(v) : null;
}

function setStr(key, value) {
    localStorage.setItem(key, value);
}

function getStr(key) {
    return localStorage.getItem(key);
}

export default { push, get, set, getStr, setStr };
