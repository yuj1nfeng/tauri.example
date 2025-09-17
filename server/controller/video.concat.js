import ffmpeg from '../utils/ffmpeg.js';
import consts from '#consts';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import fs from 'node:fs/promises';
import path from 'node:path';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_file, video_codec, audio_codec, fps, scale_width, scale_height } = body;
    const task_id = dayjs().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
    ctx.set('task_id', task_id);
    const output_dir = path.dirname(output_file);
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const progress_cb = async (progress) => await emitEvent(task_id, ((progress.current / progress.total) * 100).toFixed(2));
    const inputs = videos.map((p) => p.filename);
    await emitEvent(consts.events.info, '开始处理');
    (async () => {
        await ffmpeg.concatVideos(inputs, output_file, {
            video_codec: video_codec,
            audio_codec: audio_codec,
            fps: fps,
            scale: { width: scale_width, height: scale_height },
            crf: 23,
            progress_cb: progress_cb,
        });
        await emitEvent(task_id, '100');
        await emitEvent(consts.events.info, '处理完成');
    })();

    return ctx.json({ task_id });
};
