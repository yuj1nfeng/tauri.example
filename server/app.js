import { Hono } from 'hono';
import { upgradeWebSocket, websocket } from 'hono/bun';
import '#hono.ext';
import socket from './socket.js';
import middleware from './middleware/index.js';


process.env.PORT = 30000;
const app = new Hono();

app.onError(middleware.error);
app.use(middleware.logger);
app.use(middleware.cors);
app.register('./server/controller');
app.get('/ws', upgradeWebSocket(socket.handle));

export default {
    fetch: app.fetch,
    websocket
};
