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


const fmtFps = (fps) => {
    const [num, den] = fps.split('/');

    return Math.floor(num / den);
};
const fmtSize = (w, h) => {
    return `${w}x${h}`;
};
const fmtBitrate = (bitrate) => {
    if (bitrate > 1000000) return Math.floor(bitrate / 1000000) + 'Mbps';

    return Math.floor(bitrate / 1000) + 'kbps';
};

const fmtSamplerate = (samplerate) => {
    return (samplerate / 1000).toFixed(1) + 'kHz';
};



function fmtMeta(meta) {
    const descriptions = [];
    if (meta.video?.codec) descriptions.push(`c:v:` + `${meta.video.codec.toUpperCase()}`);
    if (meta.video?.frame_rate) descriptions.push(`fps:` + fmtFps(meta.video.frame_rate));
    if (meta.video?.bit_rate) descriptions.push(`b:v:` + fmtBitrate(meta.video.bit_rate));
    if (meta.video?.width && meta.video?.height) descriptions.push(`size:` + fmtSize(meta.video.width, meta.video.height));
    if (meta.audio?.codec) descriptions.push(`c:a:` + meta.audio.codec.toUpperCase());
    if (meta.audio?.bit_rate) descriptions.push(`b:a:` + fmtBitrate(meta.audio.bit_rate));
    if (meta.audio?.channels) descriptions.push(`channels:` + meta.audio.channels);
    if (meta.audio?.sample_rate) descriptions.push(`sr:` + fmtSamplerate(meta.audio.sample_rate));
    if (meta.audio?.duration) descriptions.push(`duration:` + fmtDuration(meta.duration || 0));

    const title = [];
    if (meta.filename) title.push('path:' + meta.filename.replace(/\\/g, '/'));
    if (meta.filename) title.push('size:' + fmtFileSize(meta.size));
    const info = {
        ...meta,
        description: descriptions.join('\t'),
        title: title.join('\t'),
        fmt_duration: fmtDuration(meta.duration || 0),
        fmt_size: fmtFileSize(meta.size || 0),
        duration: meta.duration || 0,
        size: meta.size || 0
    };
    return info;
}

export default { fmtDuration, fmtFileSize, fmtMeta };
