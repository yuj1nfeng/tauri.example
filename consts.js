

const formProps = {
    layout: 'inline', //
    labelAlign: 'left',
    size: 'mini',
    style: { width: '100%', height: '100%' },
    colon: true,
};

const events = {
    concat_vidoe_progeress: 'concat-progress',
    split_video_progeress: 'split-progress',
    add_watermark_progeress: 'add-watermark-progress',
    remove_audio_progeress: 'remove-audio-progress',
    extra_audio_progeress: 'extra-audio-progress',
    remove_subtitle_progeress: 'remove-subtitle-progress',
    reove_watermark_progeress: 'remove-watermark-progress',
};


const options = {

    video_output_fmt: [
        { label: 'mp4', value: 'mp4' },
        { label: 'mkv', value: 'mkv' },
        { label: 'avi', value: 'avi' },
        { label: 'mov', value: 'mov' },
        { label: 'wmv', value: 'wmv' },
        { label: 'flv', value: 'flv' },
    ],

    audio_output_fmt: [
        { label: 'mp3', value: 'mp3' },
        { label: 'wav', value: 'wav' },
        { label: 'aac', value: 'aac' },
        { label: 'flac', value: 'flac' },
    ],

    video_codec: [
        { label: 'h264', value: 'h264' },
        { label: 'h265', value: 'h265' },
        { label: 'vp8', value: 'vp8' },
        { label: 'vp9', value: 'vp9' },
    ],

    audio_codec: [
        { label: 'aac', value: 'aac' },
        { label: 'mp3', value: 'mp3' },
    ]
};


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


export default { events, options, formProps, fmtDuration, fmtFileSize, fmtMeta };