import { streamSSE } from 'hono/streaming';

const clients = [];

export const emitEvent = async (event, data, client_id = 'all') => {
    if (client_id === 'all') {
        for (const client of clients) await client.writeSSE({ data: data, event });
        return;
    }
    await clients.find((stream) => stream.client_id === client_id).writeSSE({ data, event });
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
            const message = `It is ${new Date().toISOString()}`;
            await stream.writeSSE({ data: message, event: 'time-update' });
            await stream.sleep(1000);
        }
    });
};
