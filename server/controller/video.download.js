import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import utils from '../utils/index.js';
import * as sse from '../middleware/sse.js';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { url, output_dir } = body;
    const task_id = utils.random.createTaskId();
    ctx.set('task_id', task_id);
    const progress_cb = async (progress) => await sse.sendTaskProgress(task_id, progress.toFixed(2));
    (async () => {
        try {
            await sse.sendTaskStatus(task_id, 'running');
            await utils.ytdlp.downloadVideo(url, output_dir, progress_cb);
            await sse.sendTaskProgress(task_id, '100');
            await sse.sendTaskStatus(task_id, 'completed');
        } catch (error) {
            await sse.sendError(error.message);
            await sse.sendTaskStatus(task_id, 'failed');
        } finally {
            await sse.sendInfo('处理完成');
        }
    })();
    return ctx.json({ task_id });
};
