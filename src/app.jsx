import React from 'react';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
import yaml from 'yaml';
import utils, { tauri, consts } from './utils/index.js';
import ConcatVideos from './component/concat.videos.jsx';
import AddWatermark from './component/add.watermark.jsx';
import AutoCut from './component/auto.cut.jsx';
import ExtraAudio from './component/extra.audio.jsx';
import RemoveAudio from './component/remove.audio.jsx';
import SplitVideos from './component/split.videos.jsx';
import MediaDownload from './component/media.download.jsx';

export default function () {
    const [list, setList] = React.useState([]);
    React.useEffect(() => {
        utils.sse.check();
        (async () => setList(await utils.videoStore.getAll()))();
    });

    const addList = async (file_list) => {
        const exists_list = list.map((p) => p.filename);
        for (const file of file_list) {
            if (exists_list.includes(file)) continue;
            const result = await utils.ext.invoke('video.meta', { input: file });
            if (result.error) continue;
            const meta = consts.fn.fmtMeta(result);
            const resp = await utils.ext.invoke('video.thumbnail', { input: file });
            meta.thumbnail = resp;
            meta.id = await utils.videoStore.add(meta);
            setList((prev) => [...prev, meta]);
        }
    };
    const uploadFiles = async () => {
        const file_list = await tauri.dialog.open({ filters: [{ name: 'videos', extensions: ['mp4', 'mov'] }], multiple: true });
        await addList(file_list);
    };
    const uploadFolder = async () => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        const file_list = await utils.ext.invoke('video.all', { input: result });
        await addList(file_list);
    };
    const clearFiles = async () => {
        await utils.videoStore.clear();
        setList([]);
    };
    const removeFile = async (item, index) => {
        await utils.videoStore.delete(item.id);
        const list = await utils.videoStore.getAll();
        setList(list);
    };

    const renderItem = (item, index) => (
        <ui.List.Item
            style={{ margin: 0, padding: 0, fontSize: '10px', fontWeight: 'bold' }}
            key={index}
            actions={[<span>{item.fmt_duration}</span>, <ui.Button onClick={() => removeFile(item, index)} shape='circle' size='mini' icon={<icon.IconDelete />} />]}
        >
            <ui.List.Item.Meta
                avatar={
                    <ui.Avatar triggerIcon={<icon.IconPlayArrow onClick={() => utils.ext.invoke('video.play', { input: item.filename })} />} shape='square'>
                        <ui.Image src={item.thumbnail} />
                    </ui.Avatar>
                }
                title={item.title}
                description={item.description}
            />
        </ui.List.Item>
    );
    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 2em', fontSize: '12px', fontFamily: 'sans-serif' }}>
            <header style={{ textAlign: 'center' }}>
                <h3>🍉🍉🚀🚀🚀🍉🍉</h3>
            </header>

            <main className='main'>
                <ui.Space size='mini' style={{ marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
                    <ui.Button size='mini' onClick={uploadFiles} icon={<icon.IconUpload />}></ui.Button>
                    <MediaDownload />
                    <MediaDownload />
                    <ui.Button size='mini' onClick={uploadFolder} icon={<icon.IconFolderAdd />}></ui.Button>
                    <ui.Button size='mini' onClick={clearFiles} icon={<icon.IconDelete />}></ui.Button>
                </ui.Space>
                <ui.List size='small' style={{ height: '34vh', padding: '0 20px' }} dataSource={list} render={renderItem} />
                <ui.Tabs defaultActiveTab='1'>
                    <ui.Tabs.TabPane key='1' title='视频切片' children={<SplitVideos list={list} />} />
                    <ui.Tabs.TabPane key='2' title='添加水印' children={<AddWatermark list={list} />} />
                    <ui.Tabs.TabPane key='3' title='视频拼接' children={<ConcatVideos list={list} />} />
                    <ui.Tabs.TabPane key='4' title='音频提取' children={<ExtraAudio list={list} />} />
                    <ui.Tabs.TabPane key='5' title='音频去除' children={<RemoveAudio list={list} />} />
                    <ui.Tabs.TabPane key='6' title='自动混剪' children={<AutoCut list={list} />} />
                </ui.Tabs>
            </main>
            <footer style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, cursor: 'pointer', color: '#3e3e3e', fontSize: '8px' }}>
                <p>提示：建议框选水印时覆盖完整水印区域，避免遗漏边缘</p>
            </footer>
        </div>
    );
}
