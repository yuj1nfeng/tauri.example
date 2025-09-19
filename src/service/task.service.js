import { useRecoilState } from 'recoil';
import tasksAtom from '../store/tasks.atom.js';
import utils from '../utils/index.js';
import dayjs from 'dayjs';

export default useTaskService;

function useTaskService() {
    const [tasks, setTasks] = useRecoilState(tasksAtom);


    const listenTaskProgress = () => {
        utils.sse.addEventListener(utils.consts.events.task_progress, async function (data) {
            const { task_id, progress } = JSON.parse(data);

            console.log(utils.consts.events.task_progress, task_id, progress);
            await updateTaskProgress(task_id, Number(progress));
        });
    };

    const listenTaskStatus = () => {
        utils.sse.addEventListener(utils.consts.events.task_status, async function (data) {
            const { task_id, status } = JSON.parse(data);
            console.log(utils.consts.events.task_status, task_id, status);
            await updateTaskStatus(task_id, status);
            if (status === 'completed') await updateTaskProgress(task_id, 100);

        });
    };

    const init = async () => {
        const list = await utils.store.tasks.getAll();
        setTasks(list);
        listenTaskStatus();
        listenTaskProgress();
    };

    const create = async (type, values, progress_callback) => {
        const { task_id } = await utils.ext.invoke(type, values);
        const task = { type, values };
        task.id = task_id;
        task.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        task.status = 'created';
        task.progress = 0;
        await utils.store.tasks.add(task);
        setTasks((prev) => [...prev, task]);
        const { id } = task;
        const callback = async (data) => {
            progress_callback && progress_callback(data);
            await updateTaskProgress(id, Number(data));
            if (parseInt(data) != 100) return;
            utils.sse.removeEventListener(id, callback);
        };
        utils.sse.addEventListener(id, callback);
        return task_id;
    };
    const retry = async (id) => {
        const task = await utils.store.tasks.get(id);
        if (!task) return;
        console.log('retry', task);
        await remove(id);
        const task_id = await create(task.type, task.values);
        return task_id;
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
        const task = await utils.store.tasks.get(id);
        if (!task) return;
        const new_task = { ...task, progress };
        await utils.store.tasks.update(id, new_task);
        setTasks((prev) => prev.map((t) => (t.id === id ? new_task : t)));
    };
    const updateTaskStatus = async (id, status) => {
        const task = await utils.store.tasks.get(id);
        if (!task) return;
        const new_task = { ...task, status };
        await utils.store.tasks.update(id, new_task);
        setTasks((prev) => prev.map((t) => (t.id === id ? new_task : t)));
    };
    return { init, create, retry, remove, removeAll, updateTaskProgress, updateTaskStatus };
}
