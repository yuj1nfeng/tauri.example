// 导出模块函数
export default { downloadVideo, resolveUrl };

/**
 * 从yt-dlp输出中解析下载进度
 * @param {string} output - yt-dlp的输出文本
 * @returns {number|null} - 解析出的进度百分比，解析失败则返回null
 */
function parseYtDlpProgress(output) {
    try {
        // 将Buffer转换为字符串
        const text = new TextDecoder().decode(output);
        console.log(text);
        // 匹配下载进度百分比
        // 示例: [download]  23.5% of ~50.00MiB at  3.00MiB/s ETA 00:15
        const percentMatch = text.match(/\[download\]\s+(\d+\.\d+)%/);
        if (percentMatch && percentMatch[1]) {
            return parseFloat(percentMatch[1]);
        }

        // 匹配合并进度
        // 示例: [Merger] Merging formats into "video.mp4" 50%
        const mergerMatch = text.match(/\[Merger\].*?(\d+)%/);
        if (mergerMatch && mergerMatch[1]) {
            return parseFloat(mergerMatch[1]);
        }

        // 匹配处理进度
        // 示例: [download] 100% of 50.00MiB in 00:10
        const completeMatch = text.match(/\[download\]\s+100%/);
        if (completeMatch) {
            return 100;
        }

        return null;
    } catch (e) {
        console.error('解析yt-dlp进度失败:', e);
        return null;
    }
}

/**
 * 下载视频
 * @param {string} url - 要下载的视频URL
 * @param {string} output_file - 输出文件路径
 * @param {Function} progress_cb - 进度回调函数
 * @returns {Promise<void>}
 */
async function downloadVideo(url, output_file, progress_cb) {
    if (!url) throw new Error('URL不能为空');
    if (!output_file) throw new Error('输出文件路径不能为空');
    // 构建命令
    const cmds = ['yt-dlp'];
    cmds.push('-o', output_file);
    // cmds.push('-S', 'res:max,fps:max');
    cmds.push('-S', 'res:max');
    cmds.push('--cookies-from-browser', 'chrome');
    // 添加进度输出参数
    cmds.push('--newline'); // 确保每个进度更新都在新行
    cmds.push('--progress');
    cmds.push(url);

    console.log(`执行命令: ${cmds.join(' ')}`);

    // 启动进程
    const proc = Bun.spawn(cmds, { stdout: 'pipe', stderr: 'pipe' });
    // 处理进度输出
    if (progress_cb != null) {
        let last_progress = 0;
        await proc.stdout.pipeTo(
            new WritableStream({
                write: (chunk) => {
                    const progress = parseYtDlpProgress(chunk);
                    // 只有当进度有变化且有效时才回调
                    if (progress !== null && progress !== last_progress) {
                        last_progress = progress;
                        progress_cb(progress);
                    }
                },
            }),
        );
    }

    // 等待进程完成
    await proc.exited;

    // 检查退出状态
    if (proc.exitCode !== 0) {
        const error = await new Response(proc.stderr).text();
        throw new Error(`yt-dlp处理失败,错误信息:\r\n ${error}`);
    }
}

async function resolveUrl(url) {
    const text = await Bun.$`yt-dlp -F --cookies-from-browser chrome "${url}`.text();
    console.log(text);
    // 格式行特征：以数字/字母开头（如 137、248、sb3），包含 EXT（如 mp4、webm）
    const separator = '------------------------------------------------------------------------------------------------------------------------';
    const lines = text.split(separator)[1].trim().split('\n');
    const format_reg = /^\s*(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S*)\s+\|\s*(\S*)\s+(\S*)\s+(\S*)\s+\|\s*(\S*)\s+(\S*)\s+(\S*)\s+(\S*)\s+(\S*)\s*(.*)$/;

    const formats = lines
        .map((line) => {
            const match = line.trim().match(format_reg);
            if (!match) return null; // 过滤匹配失败的行（理论上不会出现）
            // 提取并格式化字段（空值用空字符串填充，数值字段转义）
            return {
                id: match[1]?.trim() || '', // 格式ID（如 137、248）
                ext: match[2]?.trim() || '', // 文件格式（如 mp4、webm）
                resolution: match[3]?.trim() || '', // 分辨率（如 1920x1080、audio only）
                fps: match[4]?.trim() || '', // 帧率（如 30，音频为 ''）
                channels: match[5]?.trim() || '', // 音频通道数（如 2，视频为 ''）
                fileSize: match[6]?.trim() || '', // 文件大小（如 183.08MiB）
                tbr: match[7]?.trim() || '', // 总码率（如 835k）
                proto: match[8]?.trim() || '', // 协议（如 https、m3u8）
                vcodec: match[9]?.trim() || '', // 视频编码（如 avc1.640028，音频为 'audio only'）
                vbr: match[10]?.trim() || '', // 视频码率（如 835k，音频为空）
                acodec: match[11]?.trim() || '', // 音频编码（如 mp4a.40.2，视频为空）
                info: match[12]?.trim() || '', // 附加信息（如 1080p, mp4_dash）
            };
        })
        .filter(Boolean);
    return formats;
}
