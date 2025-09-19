import ffmpeg from '../utils/ffmpeg.js';
import random from '../utils/random.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as sse from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, split_duration } = body;
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const task_id = random.createTaskId();
    ctx.set('task_id', task_id);
    const total_duration = videos.map((p) => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled = 0;
    await sse.sendInfo(`开始处理,共 ${videos.length} 个视频, 总时长 ${total_duration.toFixed(2)} 秒`);

    (async () => {
        try {
            for (const video of videos) {
                await sse.sendTaskStatus(task_id, 'running');
                const shotname = path.basename(video.filename);
                if (!video.video) {
                    await sse.sendWarning(`${shotname} 无视频, 跳过`);
                    continue;
                }
                const duration = parseInt(video.duration);
                if (duration < split_duration) {
                    handled += duration;
                    await sse.sendTaskProgress(task_id, ((handled / total_duration) * 100).toFixed(2));
                    await sse.sendWarning(`${shotname} 小于 ${split_duration} 秒, 跳过`);
                    continue;
                }
                const times = Math.ceil(duration / split_duration);
                for (let i = 0; i < times; i++) {
                    const start = i * split_duration;
                    let end = (i + 1) * split_duration;
                    end = end > duration ? duration : end;
                    const ext = path.extname(video.filename);
                    const start_str = start.toString().padStart(4, '0');
                    const end_str = end.toString().padStart(4, '0');
                    const output_name = `${path.basename(video.filename, ext)}.${start_str}-${end_str}${ext}`;
                    const output_file = path.join(output_dir, output_name);
                    await ffmpeg.sliceVideo(video.filename, output_file, { start, duration: split_duration });
                    handled += end - start;
                    await sse.sendTaskProgress(task_id, ((handled / total_duration) * 100).toFixed(2));
                }
            }
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
