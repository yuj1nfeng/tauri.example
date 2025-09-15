import createDb from './ext/create.db.js';
import sse from './sse.js';

const store = await createDb('tasks', { keyPath: 'key' }).init();

async function createTask(task_id, inputs, progress_callback = null) {
    await store.put(task_id, { inputs, progress: 0 });
    sse.addEventListener(task_id, async (data) => {
        progress_callback && progress_callback(data);
        await store.update(task_id, { progress: Number(data) });
        if (parseInt(data) != 100) return;
        sse.removeEventListener(task_id, this);
    });
}

async function getTask(task_id) {
    return await store.get(task_id);
}

async function getAllTasks() {
    return await store.getAll();
}

export default { createTask, getTask, getAllTasks };
