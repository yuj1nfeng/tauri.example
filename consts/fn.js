const fmtDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(3, '0')}:${seconds.toString().padStart(2, '0')}`;
};
const fmtFileSize = (size) => {
    const kb = Math.floor(size / 1024);
    const mb = Math.floor(kb / 1024);
    if (mb > 0) {
        return `${mb}MB`;
    }
    return `${kb}KB`;
};
function fmtMeta(meta) {
    const descriptions = [];
    if (meta.video?.codec) descriptions.push(`视频编码:` + meta.video.codec);
    if (meta.video?.frame_rate) descriptions.push(`视频帧率:` + meta.video.frame_rate);
    if (meta.video?.bit_rate) descriptions.push(`视频码率:` + meta.video.bit_rate);
    if (meta.video?.width && meta.video?.height) descriptions.push(`画面大小:` + `${meta.video.width}x${meta.video.height}`);
    if (meta.audio?.codec) descriptions.push(`音频编码:` + meta.audio.codec);
    if (meta.audio?.bit_rate) descriptions.push(`音频码率:` + meta.audio.bit_rate);
    if (meta.audio?.channels) descriptions.push(`音频通道数:` + meta.audio.channels);
    if (meta.audio?.sample_rate) descriptions.push(`音频采样率:` + meta.audio.sample_rate);

    const title = [];
    if (meta.filename) title.push('文件:' + meta.filename.replace(/\\/g, '/'));
    if (meta.filename) title.push('大小:' + fmtFileSize(meta.size));
    const info = {
        ...meta,
        description: descriptions.join('\t'),
        title: title.join('\t'),
        fmt_duration: fmtDuration(meta.duration),
        fmt_size: fmtFileSize(meta.size),
    };
    return info;
}

export default { fmtDuration, fmtFileSize, fmtMeta };
