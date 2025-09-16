import React from 'react';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import utils, { tauri, consts } from './utils/index.js';
import VideoConcat from './component/video.concat.jsx';
import VideoAddWatermark from './component/video.add.watermark.jsx';
import VideoAutoCut from './component/video.auto.cut.jsx';
import AudioExtra from './component/audio.extra.jsx';
import AudioRemove from './component/audio.remove.jsx';
import VideoSplit from './component/video.split.jsx';
import VideoDownload from './component/video.download.jsx';
import Settings from './component/settings.jsx';

export default function () {
    const [list, setList] = React.useState([]);

    const init = async () => {
        const list = await utils.videoStore.getAll();
        setList(list);
    };
    React.useEffect(() => init, []);

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
        const file_list = await tauri.dialog.open({ filters: [{ name: 'videos', extensions: ['mp4', 'mov', 'webm'] }], multiple: true });
        if (file_list.length === 0) return;
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
    const renderItems = () => {
        if (!list || list.length === 0) return <ui.Empty />;
        return list.map((item, index) => (
            <ui.List.ListItem
                key={item.id}
                style={{ maxHeight: '48px' }}
                action={
                    <ui.Space >
                        <ui.Image
                            fit='contain'
                            shape='square'
                            src={item.thumbnail}
                            style={{ height: '48px', width: 'auto', cursor: 'pointer', borderRadius: '4px' }}
                            overlayTrigger='hover'
                            overlayContent={<icon.PlayCircleIcon color='red' onClick={() => utils.ext.invoke('video.play', { input: item.filename })} />}
                        />
                        <ui.Button variant="text" shape="square" size='small' onClick={() => removeFile(item, index)} icon={<icon.DeleteIcon />}></ui.Button>
                    </ui.Space>
                }>
                <ui.List.ListItemMeta
                    description={<text style={{ fontSize: '12px', fontFamily: 'consolas', textOverflow: 'hidden' }}>{item.title}</text>}
                    title={<text style={{ fontSize: '10px', textOverflow: 'hidden' }}>{item.description}</text>}
                />
            </ui.List.ListItem>
        ));
    };
    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 2em' }}>
            <header style={{ textAlign: 'center' }}>
                <h3>🍉🍉🚀🚀🚀🍉🍉</h3>
            </header>

            <main className='main'>

                {/* <ui.StickyTool
                    style={{ position: 'absolute', top: '0', left: '0', height: "100", width: '200' }}
                    offset={[-50, -24]}
                    type='compact'
                >
                    <ui.StickyTool.StickyItem label="chat" icon={<icon.ChatIcon />}></ui.StickyTool.StickyItem>
                    <ui.StickyTool.StickyItem label="add" icon={<icon.AddIcon />}></ui.StickyTool.StickyItem>

                </ui.StickyTool> */}
                <ui.Space size='mini' style={{ marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
                    <ui.Button size='small' variant="text" shape="square" onClick={uploadFiles} icon={<icon.FileAddFilledIcon />}></ui.Button>
                    <ui.Button size='small' variant="text" shape="square" onClick={uploadFolder} icon={<icon.FolderAddFilledIcon />}></ui.Button>
                    <ui.Button size='small' variant="text" shape="square" onClick={clearFiles} icon={<icon.DeleteFilledIcon />}></ui.Button>
                    <Settings />
                </ui.Space>
                <ui.List size='small' style={{ height: '34vh', padding: '0 10px', border: '1px solid #c6c6c6', borderRadius: '8px' }} >
                    {renderItems()}
                </ui.List>
                <ui.Tabs size='medium' defaultValue='1' >
                    <ui.Tabs.TabPanel value='1' label='视频切片' children={<VideoSplit list={list} />} />
                    <ui.Tabs.TabPanel value='2' label='添加水印' children={<VideoAddWatermark list={list} />} />
                    <ui.Tabs.TabPanel value='3' label='视频拼接' children={<VideoConcat list={list} />} />
                    <ui.Tabs.TabPanel value='4' label='音频提取' children={<AudioExtra list={list} />} />
                    <ui.Tabs.TabPanel value='5' label='音频去除' children={<AudioRemove list={list} />} />
                    <ui.Tabs.TabPanel value='6' label='自动混剪' children={<VideoAutoCut list={list} />} />
                    <ui.Tabs.TabPanel value='7' label='下载视频' children={<VideoDownload list={list} />} />
                </ui.Tabs>
            </main>
            <footer style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, cursor: 'pointer', color: '#3e3e3e', fontSize: '8px' }}>
                <p>提示：建议框选水印时覆盖完整水印区域，避免遗漏边缘</p>
            </footer>
        </div>
    );
}
