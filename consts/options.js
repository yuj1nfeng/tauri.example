
export default {
    video_output_fmt: [
        { label: 'MP4', value: 'mp4' },
        { label: 'MKV', value: 'mkv' },
        { label: 'AVI', value: 'avi' },
        { label: 'MOV', value: 'mov' },
        { label: 'WMV', value: 'wmv' },
        { label: 'FLV', value: 'flv' },
    ],

    audio_output_fmt: [
        { label: 'MP3', value: 'mp3' },
        { label: 'WAV', value: 'wav' },
        { label: 'AAC', value: 'aac' },
        { label: 'FLAC', value: 'flac' },
    ],

    video_codec: [
        { label: 'H264', value: 'h264' },
        { label: 'H265', value: 'h265' },
        { label: 'VP8', value: 'vp8' },
        { label: 'CP9', value: 'vp9' },
    ],

    audio_codec: [
        { label: 'AAC', value: 'aac' },
        { label: 'MP3', value: 'mp3' },
    ],

    watermark_position: [
        { label: '左上', value: 'left-top' },
        { label: '右上', value: 'right-top' },
        { label: '左下', value: 'left-bottom' },
        { label: '右下', value: 'right-bottom' },
    ],

    browser: [
        { label: 'Edge', value: 'edge' },
        { label: 'Firefox', value: 'firefox' },
        { label: 'Chrome', value: 'chrome' },
        { label: 'Chromium', value: 'chromium' },
        { label: 'Opera', value: 'opera' },
        { label: 'Safari', value: 'safari' },
        { label: 'Vivaldi', value: 'vivaldi' },
        { label: 'Brave', value: 'brave' },
        { label: 'Whale', value: 'whale' },
    ],
};
