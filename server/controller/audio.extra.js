import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import path from 'node:path';
import socket from '../socket.js';
import consts from '../../consts.js';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_dir, audio_output_fmt, audio_codec, audio_bit_rate } = body;

    if (!await fs.exists(output_dir)) await fs.mkdir(output_dir, { recursive: true, force: true });

    socket.sendMessage({ type: 'info', data: '开始处理' });
    const total_duration = videos.map(p => Number(p.duration)).reduce((a, b) => a + b, 0);
    let handled = 0;
    const progress_cb = (progress) => {
        const percent = ((progress.current + handled) / total_duration * 100).toFixed(2);
        socket.sendMessage({ type: consts.events.extra_audio_progeress, data: percent });
    };
    for (const video of videos) {
        if (!video.audio) {
            socket.sendMessage({ type: 'warning', data: `${video.filename} 无音频, 跳过` });
            continue;
        }
        const output = path.join(output_dir, `${path.basename(video.filename, path.extname(video.filename))}.${audio_output_fmt}`);
        await ffmpeg.extraAudio(video.filename, output, { codec: audio_codec, bitrate: audio_bit_rate, progress_cb: progress_cb });
        handled += Number(video.duration);
    }
    socket.sendMessage({ type: 'info', data: '处理完成' });
    return ctx.json({ output: 'ok' });
};
