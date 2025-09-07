import { Hono } from 'hono';
import { upgradeWebSocket, websocket } from 'hono/bun';
import socket from './socket.js';
import middleware from './middleware/index.js';
import audioExtra from './controller/audio.extra.js';
import audioRemove from './controller/audio.remove.js';
import videoAll from './controller/video.all.js';
import videoConcat from './controller/video.concat.js';
import videoMeta from './controller/video.meta.js';
import videoPlay from './controller/video.play.js';
import videoThumbnail from './controller/video.thumbnail.js';

process.env.PORT = 30000;
const app = new Hono();

app.onError(middleware.error);
app.use(middleware.logger);
app.use(middleware.cors);
app.get('/ws', upgradeWebSocket(socket.handle));
app.post('audio.extra', await import('./controller/audio.extra.js').then(m => m.default));
app.post('audio.remove', await import('./controller/audio.remove.js').then(m => m.default));
app.post('video.all', await import('./controller/video.all.js').then(m => m.default));
app.post('video.concat', await import('./controller/video.concat.js').then(m => m.default));
app.post('video.meta', await import('./controller/video.meta.js').then(m => m.default));
app.post('video.play', await import('./controller/video.play.js').then(m => m.default));
app.post('video.thumbnail', await import('./controller/video.thumbnail.js').then(m => m.default));



export default {
    fetch: app.fetch,
    websocket
};
