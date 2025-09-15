async function downloadVideo(url, output_dir,progress_cb) {
    const cmds = ['yt-dlp'];
    cmds.push('-o', output_file, url);
    cmds.push('-S', 'res:max,fps:max');
    cmds.push('--cookies-from-browser', 'chrome');
    cmds.push(url);
    const proc = Bun.spawn(cmds, { stdout: 'pipe', stderr: 'pipe' });
    const [progress_stream, err_stream] = proc.stderr.tee();
    if (progress_cb != null) {
       
        await progress_stream.pipeTo(new WritableStream({ write: (chunk) => {
            // progressHandler.handleOutput(chunk) --- IGNORE ---
            
            console.log(chunk);

        } }));
    }
    await proc.exited;
    if (proc.exitCode !== 0) {
        const error = await new Response(err_stream).text();
        throw new Error(`FFMPEG处理失败,错误信息:\r\n ${error}`);
    }
}


