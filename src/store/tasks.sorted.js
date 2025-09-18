
import { selector } from 'recoil';
import tasksAtom from './tasks.atom.js';
import dayjs from 'dayjs';

export default selector({
    key: 'tasks.sorted',
    get: ({ get }) => {
        const tasks = get(tasksAtom);
        // return tasks;
        return [...tasks].sort((a, b) => Number(b.id) - Number(a.id));
    },
});
