import { streamSSE } from 'hono/streaming';
import consts from '#consts';

const clients = [];

export const emitEvent = async (event, data, client_id = 'all') => {
    if (client_id === 'all') {
        if (clients.length === 0) return;

        for (const stream of clients) {
            if (stream.closed) continue;
            await stream.writeSSE({ data, event });
        }
        return;
    }
    await clients.find((stream) => stream.client_id === client_id).writeSSE({ data, event });
};

export const sendTaskProgress = async (task_id, progress) => {
    await emitEvent(consts.events.task_progress, JSON.stringify({ task_id, progress }));
    await emitEvent(task_id, progress);
};
export const sendTaskStatus = async (task_id, status) => {
    await emitEvent(consts.events.task_status, JSON.stringify({ task_id, status }));
};


export const sendError = async (msg) => {
    await emitEvent(consts.events.error, msg);
};
export const sendInfo = async (msg) => {
    await emitEvent(consts.events.info, msg);
};
export const sendWarning = async (msg) => {
    await emitEvent(consts.events.warning, msg);
};

export default (c) => {
    return streamSSE(c, async (stream) => {
        clients.push(stream);
        console.log(`客户端连接，当前连接数: ${clients.length}`);
        stream.onAbort(() => {
            const index = clients.findIndex((client) => client === stream);
            if (index !== -1) clients.splice(index, 1);
            console.log(`客户端已断开连接，当前连接数: ${clients.length}`);
        });
        await stream.writeSSE({ data: '欢迎连接到时间流', event: 'welcome' });
        await stream.sleep(1000);
        while (true) {
            const message = `${new Date().toISOString()}`;
            await stream.writeSSE({ data: message, event: 'heartbeat' });
            await stream.sleep(5000);
        }
    });
};
