import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, audio_output_fmt, audio_codec, audio_bit_rate } = body;
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const task_id = dayjs().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
    ctx.set('task_id', task_id);
    await emitEvent(consts.events.info, '开始处理');
    const total_duration = videos.map((p) => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled = 0;
    const progress_cb = async (progress) => await emitEvent(task_id, (((progress.current + handled) / total_duration) * 100).toFixed(2));
    await emitEvent(consts.events.info, `共 ${videos.length} 个视频, 总时长 ${total_duration.toFixed(2)} 秒`);
    (async () => {
        try {
            for (const video of videos) {
                if (!video.audio) {
                    await emitEvent(consts.events.warning, `${video.filename} 无音频, 跳过`);
                    continue;
                }
                const output = path.join(output_dir, `${path.basename(video.filename, path.extname(video.filename))}.${audio_output_fmt}`);
                await ffmpeg.extraAudio(video.filename, output, {  progress_cb: progress_cb });
                handled += Number(video.duration);
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
