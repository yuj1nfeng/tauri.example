import { useRecoilState } from 'recoil';
import tasksAtom from '../store/tasks.atom.js';
import utils from '../utils/index.js';

export default useTaskService;

function useTaskService() {
    const [tasks, setTasks] = useRecoilState(tasksAtom);
    const init = async () => {
        const list = await utils.store.tasks.getAll();
        setTasks(list);
    };
    const add = async (task, progress_callback) => {
        await utils.store.tasks.add(task);
        setTasks((prev) => [...prev, task]);
        const { id } = task;
        utils.sse.addEventListener(id, async function (data) {
            progress_callback && progress_callback(data);
            await utils.store.tasks.update(id, { progress: Number(data) });
            if (parseInt(data) != 100) return;
            utils.sse.removeEventListener(id, this);
        });
    };
    const remove = async (id) => {
        await utils.store.tasks.delete(id);
        const list = await utils.store.tasks.getAll();
        setTasks(list);
        // setTasks((prev) => prev.filter((v) => v.id !== id));
    };
    const removeAll = async () => {
        await utils.store.tasks.clear();
        setTasks([]);
    };
    const updateTaskProgress = async (id, progress) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        const new_task = { ...task, progress };
        await utils.store.tasks.update(id, new_task);
        setTasks((prev) => prev.map((t) => (t.id === id ? new_task : t)));
    };
    const updateTaskStatus = async (id, status) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        const new_task = { ...task, status };
        await utils.store.tasks.update(id, new_task);
        setTasks((prev) => prev.map((t) => (t.id === id ? new_task : t)));
    };
    return { init, add, remove, removeAll, updateTaskProgress, updateTaskStatus };
}
