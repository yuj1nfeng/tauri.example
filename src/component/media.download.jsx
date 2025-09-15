import React from 'react';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
import utils from '../utils/index.js';
export default function () {
    const openModal = () => {
        ui.Modal.info({
            style: { padding: '12px 12px' },
            title: '请输入视频链接地址',
            content: <ui.Form children={<ui.Input placeholder='请输入视频链接' />} />,
            onOk: downloadMedia,
            closable: true,
            maskClosable: false,
            autoFocus: true,
            footer: () => (
                <ui.Button type='primary' onClick={downloadMedia} style={{ width: '100%' }}>
                    开始下载
                </ui.Button>
            ),
        });
    };

    const downloadMedia = async () => {
        // https://youtu.be/8_F5_AXtaxM
        const result = await utils.ext.invoke('media.download', { url: 'https://youtu.be/8_F5_AXtaxM' });
        console.log(result);
    };

    return <ui.Button size='mini' onClick={openModal} icon={<icon.IconCloudDownload />}></ui.Button>;
}
