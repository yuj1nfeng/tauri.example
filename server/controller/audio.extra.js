import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, output_fmt, audio_codec, audio_bit_rate } = body;
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
                const duration = parseInt(video.duration);
                if (!video.audio) {
                    handled += duration;
                    await emitEvent(task_id, ((handled / total_duration) * 100).toFixed(2));
                    await emitEvent(consts.events.warning, `${shotname} 无音频, 跳过`);
                    continue;
                }
                const output = path.join(output_dir, `${path.basename(video.filename, path.extname(video.filename))}.${output_fmt}`);
                await ffmpeg.extraAudio(video.filename, output, { progress_cb: progress_cb });
                handled += Number(video.duration);
            }
        } catch (error) {
            await emitEvent(consts.events.error, error.message);
        } finally {
            await emitEvent(task_id, '100');
        }
    })();
    return ctx.json({ task_id });
};
