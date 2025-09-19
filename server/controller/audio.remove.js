import ffmpeg from '../utils/ffmpeg.js';
import random from '../utils/random.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as sse from '../middleware/sse.js';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, output_fmt = 'mp4', video_codec = '' } = body;
    if (!(await fs.exists(output_dir))) await fs.mkdir(output_dir, { recursive: true, force: true });
    const task_id = random.createTaskId();
    ctx.set('task_id', task_id);
    const total_duration = videos.map((p) => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled = 0;
    const progress_cb = async (progress) => await sse.sendTaskProgress(task_id, (((progress.current + handled) / total_duration) * 100).toFixed(2));
    await sse.sendInfo(`开始处理,共 ${videos.length} 个视频, 总时长 ${total_duration.toFixed(2)} 秒`);
    (async () => {
        try {
            for (const video of videos) {
                await sse.sendTaskStatus(task_id, 'running');
                const shotname = path.basename(video.filename);
                const duration = parseInt(video.duration);
                if (!video.audio) {
                    handled += duration;
                    await sse.sendTaskProgress(task_id, ((handled / total_duration) * 100).toFixed(2));
                    await sse.sendWarning(`${shotname} 无音频, 跳过`);
                    continue;
                }
                const output = path.join(output_dir, `${path.basename(video.filename, path.extname(video.filename))}.na.${output_fmt}`);
                await ffmpeg.remvoeAudio(video.filename, output, { codec: video_codec, progress_cb: progress_cb });
                handled += Number(video.duration);
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
