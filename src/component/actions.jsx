import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import VideoUpload from './action/video.file.upload';
import VideoUploadFromFolder from './action/video.folder.upload';
import VideoClear from './action/video.clear';
import Settings from './action/settings';

export default function () {
    return (
        <ui.Space size='mini' style={{ marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <VideoUpload />
            <VideoUploadFromFolder />
            <VideoClear />
            <Settings />
        </ui.Space>
    );
}