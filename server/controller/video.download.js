import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { url, output_dir } = body;
    // const output_dir = '/Users/yujf/Downloads/%(title)s.%(ext)s';
    const output_file = path.join(output_dir, '%(title)s.%(ext)s');

    const cmds = ['yt-dlp'];
    cmds.push('-o', output_file, url);
    cmds.push('-S', 'res:max,fps:max');
    cmds.push('--cookies-from-browser', 'chrome');
    cmds.push(url);
    const proc = Bun.spawn(cmds, { stdout: 'pipe', stderr: 'pipe' });
    const [progress_stream, err_stream] = proc.stderr.tee();
    if (progress_cb != null) {
        const progressHandler = createProgressHandler(progress_cb);
        const duration = await getVideoDuration(input);
        progressHandler.setTotalDuration(duration);
        await progress_stream.pipeTo(new WritableStream({ write: (chunk) => progressHandler.handleOutput(chunk) }));
    }
    await proc.exited;
    if (proc.exitCode !== 0) {
        const error = await new Response(err_stream).text();
        throw new Error(`FFMPEG处理失败,错误信息:\r\n ${error}`);
    }

    return ctx.json({});
};
