import { Hono } from 'hono';
import middleware from './middleware/index.js';

const app = new Hono();

app.onError(middleware.error);
app.use(middleware.logger);
app.use(middleware.cors);
app.get('/sse', middleware.sse);
app.post('/audio.extra', await import('./controller/audio.extra.js').then((m) => m.default));
app.post('/audio.remove', await import('./controller/audio.remove.js').then((m) => m.default));
app.post('/video.all', await import('./controller/video.all.js').then((m) => m.default));
app.post('/video.concat', await import('./controller/video.concat.js').then((m) => m.default));
app.post('/video.meta', await import('./controller/video.meta.js').then((m) => m.default));
app.post('/video.play', await import('./controller/video.play.js').then((m) => m.default));
app.post('/video.thumbnail', await import('./controller/video.thumbnail.js').then((m) => m.default));
app.post('/video.split', await import('./controller/video.split.js').then((m) => m.default));
app.post('/video.add.watermark', await import('./controller/video.add.watermark.js').then((m) => m.default));
app.post('/video.auto.cut', await import('./controller/video.auto.cut.js').then((m) => m.default));
app.post('/video.download', await import('./controller/video.download.js').then((m) => m.default));

app.get('/', async (c) => {
    c.set('hello', 'world');
    return c.json({ status: 'ok' });
});

export default app;

// export default Bun.serve({
//     fetch: app.fetch,
//     port: 3000,
//     development: true,
// });
