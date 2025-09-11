import { emitEvent } from './sse.js';
import consts from '#consts';
export default async (err, c) => {
    c.status(500);
    const task_id=c.get('task_id');
    if(task_id) await emitEvent(task_id, '100');

    await emitEvent(consts.events.error, err.message);
    return c.json({ error: err.message });
};
