import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import path from 'node:path';
import socket from '../socket.js';


export default async (ctx) => {
    const body = await ctx.req.json();
    const { videos, output_file, video_bit_rate, video_codec, audio_codec, audio_bit_rate, audio_channels, audio_sample_rate } = body;
    const progress_cb = (progress) => socket.sendMessage({ type: 'concat-progress', data: (progress.current / progress.total * 100).toFixed(2) });
    const inputs = videos.map((p) => p.filename);
    socket.sendMessage({ type: 'info', data: '开始处理' });
    const result = await ffmpeg.concatVideos(inputs, output_file, {
        video_codec: video_codec,
        audio_codec: audio_codec,
        crf: 23,
        progress_cb: progress_cb
    });
    socket.sendMessage({ type: 'info', data: '处理完成' });
    return ctx.json({ output: result });
};
