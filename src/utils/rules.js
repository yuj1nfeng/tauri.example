const audioExtraRules = {
    output_fmt: [{ required: true, message: '请设置输出格式' }],
    output_dir: [{ required: true, message: '请设置输出目录' }],
    audio_bitrate: [{ required: true, message: '请设置音频码率' }],
};

const audioRemoveRules = {
    output_fmt: [{ required: true, message: '请设置输出格式' }],
    output_dir: [{ required: true, message: '请设置输出目录' }],
};

const videoAddWatermarkRules = {
    output_fmt: [{ required: true, message: '请设置输出格式' }],
    output_dir: [{ required: true, message: '请设置输出目录' }],
    scale: [{ required: true, message: '请设置缩放比例' }],
    opacity: [{ required: true, message: '请设置不透明度' }],
    position: [{ required: true, message: '请设置水印位置' }],
    watermark: [{ required: true, message: '请设置水印图片' }],
};

const videoAutoCutRules = {
    output_fmt: [{ required: true, message: '请设置输出格式' }],
    output_dir: [{ required: true, message: '请设置输出目录' }],
    video_codec: [{ required: true, message: '请设置视频编码' }],
    audio_codec: [{ required: true, message: '请设置音频编码器' }],
    output_fmt: [{ required: true, message: '请设置输出格式' }],
    scale_width: [{ required: true, message: '请设置画面宽度' }],
    scale_height: [{ required: true, message: '请设置画面高度' }],
    min_duration: [{ required: true, message: '请设置最小时长' }],
    max_duration: [{ required: true, message: '请设置最大时长' }],
    audio_channels: [{ required: true, message: '请设置音频通道数' }],
    audio_bit_rate: [{ required: true, message: '请设置音频码率' }],
};

const videoConcatRules = {
    fps: [{ required: true, message: '请设置视频帧率' }],
    video_codec: [{ required: true, message: '请设置视频编码' }],
    audio_codec: [{ required: true, message: '请设置音频编码器' }],
    output_fmt: [{ required: true, message: '请设置输出格式' }],
    scale_width: [{ required: true, message: '请设置画面宽度' }],
    scale_height: [{ required: true, message: '请设置画面高度' }],
    output_dir: [{ required: true, message: '请设置输出目录' }],
};

const videoDownloadRules = {
    browser: [{ required: true, message: '请设置cookie来源' }],
    output_dir: [{ required: true, message: '请设置输出目录' }],
    url: [{ required: true, message: '请设置下载地址' }],
};

const videoSplitRules = {
    output_dir: [{ required: true, message: '请设置输出目录' }],
    split_duration: [{ required: true, message: '请设置输出目录' }],
};

export default {
    audioExtraRules,
    audioRemoveRules,
    videoAddWatermarkRules,
    videoAutoCutRules,
    videoConcatRules,
    videoDownloadRules,
    videoSplitRules,
};
