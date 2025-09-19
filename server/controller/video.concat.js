import ffmpeg from '../utils/ffmpeg.js';
import random from '../utils/random.js';
import * as sse from '../middleware/sse.js';
import dayjs from 'dayjs';
import fs from 'node:fs/promises';
import path from 'node:path';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_file, video_codec, audio_codec, fps, scale_width, scale_height } = body;
    const task_id = random.createTaskId();
    ctx.set('task_id', task_id);
    const output_dir = path.dirname(output_file);
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const progress_cb = async (progress) => await sse.sendTaskProgress(task_id, ((progress.current / progress.total) * 100).toFixed(2));
    const inputs = videos.map((p) => p.filename);
    await sse.sendInfo('开始处理');
    (async () => {
        try {
            setTimeout(() => sse.sendTaskStatus(task_id, 'running'), 300);
            await ffmpeg.concatVideos(inputs, output_file, {
                video_codec: video_codec,
                audio_codec: audio_codec,
                fps: fps,
                scale: { width: scale_width, height: scale_height },
                crf: 23,
                progress_cb: progress_cb,
            });
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
