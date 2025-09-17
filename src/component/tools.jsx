import * as ui from 'tdesign-react';
import VideoSplit from './tool/video.split';
import VideoConcat from './tool/video.concat';
import VideoAddWatermark from './tool/video.add.watermark';
import VideoAutoCut from './tool/video.auto.cut';
import AudioExtra from './tool/audio.extra';
import AudioRemove from './tool/audio.remove';
import VideoDownload from './tool/video.download';



const panel_list = [
    { value: '1', label: '视频切片', children: <VideoSplit /> },
    { value: '2', label: '添加水印', children: <VideoAddWatermark /> },
    { value: '3', label: '视频拼接', children: <VideoConcat /> },
    { value: '4', label: '音频提取', children: <AudioExtra /> },
    { value: '5', label: '音频去除', children: <AudioRemove /> },
    { value: '6', label: '自动混剪', children: <VideoAutoCut /> },
    { value: '7', label: '下载视频', children: <VideoDownload /> },
];
export default function () {
    return (<ui.Tabs size='medium' defaultValue='1' list={panel_list} />);
}
