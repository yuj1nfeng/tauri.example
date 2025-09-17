import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import Settings from './settings.jsx';
import useVideoService from '../service/video.service.js';



export default function () {
    const videoService = useVideoService();
    return (
        <ui.Space size='mini' style={{ marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <ui.Button size='small' variant="text" shape="square" onClick={videoService.uploadFiles} icon={<icon.FileAddFilledIcon />}></ui.Button>
            <ui.Button size='small' variant="text" shape="square" onClick={videoService.uploadFolder} icon={<icon.FolderAddFilledIcon />}></ui.Button>
            <ui.Button size='small' variant="text" shape="square" onClick={videoService.removeAll} icon={<icon.DeleteFilledIcon />}></ui.Button>
            <Settings />
        </ui.Space>
    );
}