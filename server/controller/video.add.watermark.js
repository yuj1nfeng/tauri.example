import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, output_fmt, position, scale, opacity = 1 } = body;
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const task_id = dayjs().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
    ctx.set('task_id', task_id);
    const total_duration = videos.map((p) => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled = 0;
    const progress_cb = async (progress) => await emitEvent(task_id, (((progress.current + handled) / total_duration) * 100).toFixed(2));
    await emitEvent(consts.events.info, `开始处理,共 ${videos.length} 个视频, 总时长 ${total_duration.toFixed(2)} 秒`);
    (async () => {
        try {
            for (const video of videos) {
                const shotname = path.basename(video.filename);
                const ext = path.extname(video.filename);
                const duration = parseInt(video.duration);
                if (!video.video) {
                    await emitEvent(consts.events.warning, `${shotname} 无视频, 跳过`);
                    continue;
                }
                const watermark = 'd:/test/1.png';
                const output_name = `${path.basename(video.filename, ext)}.watermark.${output_fmt}`;
                const output_file = path.join(output_dir, output_name);
                await ffmpeg.addWatermark(video.filename, watermark, output_file, { position, scale, opacity, progress_cb: progress_cb });
                handled += duration;
            }
            await emitEvent(consts.events.info, '处理完成');
        } catch (error) {
            await emitEvent(consts.events.error, error.message);
        } finally {
            await emitEvent(task_id, '100');
        }
    })();
    return ctx.json({ task_id });
};
