import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import useVideoService from '@/service/video.service.js';



export default function () {
    const videoService = useVideoService();
    return <ui.Button size='small' variant="text" shape="square" onClick={videoService.uploadFiles} icon={<icon.FileAddFilledIcon />} />;

}