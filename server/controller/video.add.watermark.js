import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as sse from '../middleware/sse.js';
import utils from '../utils/index.js';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, output_fmt, position, scale, opacity, watermark } = body;
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const task_id = utils.random.createTaskId();
    ctx.set('task_id', task_id);
    const total_duration = videos.map((p) => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled = 0;
    const progress_cb = async (progress) => await sse.sendTaskProgress(task_id, (((progress.current + handled) / total_duration) * 100).toFixed(2));
    await sse.sendInfo(`开始处理,共 ${videos.length} 个视频, 总时长 ${total_duration.toFixed(2)} 秒`);
    const { path: watermark_file } = await utils.base64ToFile(watermark);

    (async () => {
        try {
            for (const video of videos) {
                await sse.sendTaskStatus(task_id, 'running');
                const shotname = path.basename(video.filename);
                const ext = path.extname(video.filename);
                const duration = parseInt(video.duration);
                if (!video.video) {
                    await sse.sendWarning(`${shotname} 无视频, 跳过`);
                    continue;
                }
                const output_name = `${path.basename(video.filename, ext)}.watermark.${output_fmt}`;
                const output_file = path.join(output_dir, output_name);
                await ffmpeg.addWatermark(video.filename, watermark_file, output_file, { position, scale, opacity, progress_cb: progress_cb });
                handled += duration;
            }
            await fs.unlink(watermark_file);
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
