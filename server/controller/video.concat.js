import ffmpeg from '#ffmpeg';
import consts from '#consts';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';

export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_file, video_bit_rate, video_codec, audio_codec, audio_bit_rate, audio_channels, audio_sample_rate } = body;
    const task_id = dayjs().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000);
    ctx.set('task_id', task_id);
    const progress_cb = async (progress) => await emitEvent(task_id, ((progress.current / progress.total) * 100).toFixed(2));
    const inputs = videos.map((p) => p.filename);
    await emitEvent(consts.events.info, '开始处理');
    (async () => {
        await ffmpeg.concatVideos(inputs, output_file, {
            video_codec: video_codec,
            audio_codec: audio_codec,
            crf: 23,
            progress_cb: progress_cb,
        });
        await emitEvent(task_id, '100');
        await emitEvent(consts.events.info, '处理完成');
    })();

    return ctx.json({ task_id });
};
