import ffmpeg from '../utils/ffmpeg.js';
import random from '../utils/random.js';
import consts from '#consts';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_file, min_duration, max_duration, output_fmt, crf, preset, video_codec, video_bit_rate, audio_codec, audio_bit_rate, audio_channels, audio_sample_rate } = body;
    const task_id = dayjs().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
    ctx.set('task_id', task_id);
    let total_duration = videos.map((p) => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled_duration = 0;
    const progress_cb = async (progress) => await emitEvent(task_id, (((progress.current + handled_duration) / total_duration) * 100).toFixed(2));

    await emitEvent(consts.events.info, '开始处理');
    (async () => {
        const work_dir = path.join(os.tmpdir(), task_id);
        await fs.mkdir(work_dir, { recursive: true });
        const cliped_videos = [];
        // 1. 裁剪片段
        for (const video of videos) {
            const shotname = path.basename(video.filename);
            const duration = parseInt(video.duration || 0);
            const ext = path.extname(shotname);
            let [min, max] = [min_duration, max_duration];
            max = max > duration ? duration : max;
            if (!video.video) {
                handled_duration += duration;
                await emitEvent(consts.events.warning, `${shotname} 无视频, 跳过`);
                continue;
            }
            if (duration < min) {
                await emitEvent(consts.events.warning, `${shotname} 时长不够, 跳过`);
                continue;
            }
            const output = path.join(work_dir, shotname);
            const clip_duration = random.getRandomInt(min, max);
            const max_start = Math.max(0, duration - clip_duration);
            await ffmpeg.sliceVideo(video.filename, output, { start: max_start, duration: clip_duration, progress_cb: progress_cb });
            cliped_videos.push(output);
            total_duration += clip_duration * 2; // 裁剪的视频还需要两个步骤,所以乘以二
            handled_duration += duration;
        }
        // 2. 统一转码
        const fmt_output_dir = path.join(work_dir, 'fmt');
        await fs.mkdir(fmt_output_dir, { recursive: true });
        const concat_inputs = [];
        for (const input of cliped_videos) {
            const output = path.join(fmt_output_dir, `${path.basename(input)}.${output_fmt}`);
            await ffmpeg.convertVideoFmt(input, output, { codec: video_codec, crf: crf, preset: preset, progress_cb: progress_cb });
            handled_duration += await ffmpeg.getVideoDuration(input);
            concat_inputs.push(output);
        }
        // 3. 拼接,上一步已经进行了统一转码,这里只需要复制就行
        await ffmpeg.concatVideos(concat_inputs, output_file, { progress_cb: progress_cb });
        // 4. 清理临时文件
        await fs.rmdir(work_dir, { recursive: true });
        // 5. 通知
        await emitEvent(task_id, '100');
        await emitEvent(consts.events.info, '处理完成');
    })();

    return ctx.json({ task_id });
};
