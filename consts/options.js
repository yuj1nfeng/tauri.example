export default {
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
    ],

    watermark_position: [
        { label: '左上', value: 'left-top' },
        { label: '右上', value: 'right-top' },
        { label: '左下', value: 'left-bottom' },
        { label: '右下', value: 'right-bottom' },
    ],
};
