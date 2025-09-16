import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import utils from '../utils/index.js';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { url, output_dir } = body;
    const task_id = dayjs().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
    ctx.set('task_id', task_id);
    const progress_cb = async (progress) => await emitEvent(task_id, progress.toFixed(2));
    (async () => {
        try {
            await utils.ytdlp.downloadVideo(url, output_dir, progress_cb);
        } catch (error) {
            await emitEvent(consts.events.error, error.message);
        } finally {
            await emitEvent(task_id, '100');
        }
    })();
    return ctx.json({ task_id });
};
