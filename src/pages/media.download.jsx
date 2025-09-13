import React from 'react';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
export default function () {
    const openModal = () => {
        ui.Modal.info({
            style: { padding: '8px 12px' },
            title: '请输入视频链接地址',
            content: <ui.Input placeholder='请输入视频链接' />,
            onOk: downloadMedia,
        });
    };

    const downloadMedia = () => {
        alert('start download');
    };

    return <ui.Button size='mini' onClick={openModal} icon={<icon.IconCloudDownload />}></ui.Button>;
}
