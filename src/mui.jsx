import React from 'react';
import PropTypes from 'prop-types';
import * as ui from '@mui/material';
import * as icon from '@mui/icons-material';
import tauri from './utils/tauri.js';
import service from './utils/service.js';
import consts from '#consts';
import sse from './utils/sse.js';
import ConcatVideos from './pages/concat.videos.jsx';
import AddWatermark from './pages/add.watermark.jsx';
import AutoCut from './pages/auto.cut.jsx';
import ExtraAudio from './pages/extra.audio.jsx';
import RemoveAudio from './pages/remove.audio.jsx';
import RemoveSubtitle from './pages/remove.subtitle.jsx';
import RemoveWatermark from './pages/remove.watermark.jsx';
import SplitVideos from './pages/split.videos.jsx';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <ui.Box sx={{ p: 3 }}>{children}</ui.Box>}
        </div>
    );
}

export default function () {
    const [activeTab, setActiveTab] = React.useState(0);
    const [list, setList] = React.useState([]);
    React.useEffect(() => sse.check());
    const uploadFiles = async () => {
        const result = await tauri.dialog.open({ filters: [{ name: 'videos', extensions: ['mp4', 'mov'] }], multiple: true });
        for (const file of result) {
            const result = await service.getVideoMeta(file);
            if (result.error) continue;
            const meta = consts.fn.fmtMeta(result);
            meta.thumbnail = await service.getThumbnail(file);
            setList((prev) => [...prev, meta]);
        }
    };

    const uploadFolder = async () => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        const file_list = await service.getAllVideos(result);
        for (const file of file_list) {
            const result = await service.getVideoMeta(file);
            console.log('result', result);
            if (result.error) continue;
            const meta = consts.fn.fmtMeta(result);
            meta.thumbnail = await service.getThumbnail(file);

            setList((prev) => [...prev, meta]);
        }
    };
    const clearFiles = () => setList([]);
    const removeFile = (index) => {
        setList((prev) => {
            const new_list = [...prev];
            new_list.splice(index, 1);
            return new_list;
        });
    };
    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 2em', fontSize: '12px', fontFamily: 'sans-serif' }}>
            <header style={{ textAlign: 'center' }}>
                <h3>🍉🍉🚀🚀🚀🍉🍉</h3>
            </header>

            <ui.Card>
                <ui.CardActions>
                    <ui.Button onClick={uploadFiles} children={<icon.Add />} />
                    <ui.Button onClick={uploadFolder} children={<icon.Folder />} />
                    <ui.Button onClick={clearFiles} children={<icon.Delete />} />
                </ui.CardActions>

                <ui.CardContent>
                    <ui.List dense={true} style={{ height: '300px', overflow: 'auto' }}>
                        {list.map((item, index) => {
                            return (
                                <ui.ListItem index={index} key={index}>
                                    <ui.ListItemAvatar onClick={service.playVideo(item.filename)} children={<ui.Avatar src={item.thumbnail} />} />
                                    <ui.ListItemText primary={item.title} secondary={item.description} />
                                    <ui.ListItemIcon children={<icon.Delete onClick={() => removeFile(index)} />} />
                                </ui.ListItem>
                            );
                        })}
                    </ui.List>
                </ui.CardContent>
            </ui.Card>

            <ui.Box sx={{ width: '100%' }}>
                <ui.Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <ui.Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} aria-label='basic tabs example' variant='scrollable' scrollButtons='auto'>
                        <ui.Tab label='视频拼接' id='simple-tab-0' aria-controls='p1' />
                        <ui.Tab label='添加水印' id='simple-tab-1' aria-controls='p2' />
                        <ui.Tab label='自动混剪' id='simple-tab-2' aria-controls='p3' />
                        <ui.Tab label='提取音频' id='simple-tab-2' aria-controls='p4' />
                        <ui.Tab label='移除音频' id='simple-tab-2' aria-controls='p5' />
                        <ui.Tab label='移除字幕' id='simple-tab-2' aria-controls='p6' />
                        <ui.Tab label='移除水印' id='simple-tab-2' aria-controls='p7' />
                        <ui.Tab label='视频分cut' id='simple-tab-2' aria-controls='p8' />
                        <ui.Tab label='视频合并' id='simple-tab-2' aria-controls='p9' />
                    </ui.Tabs>
                    <TabPanel value={activeTab} index={0} id='p1' children={<ConcatVideos list={[]} />} />
                    <TabPanel value={activeTab} index={1} id='p2' children={<AddWatermark list={[]} />} />
                    <TabPanel value={activeTab} index={2} id='p3' children={<AutoCut list={[]} />} />
                    <TabPanel value={activeTab} index={3} id='p4' children={<ExtraAudio list={[]} />} />
                    <TabPanel value={activeTab} index={4} id='p5' children={<RemoveAudio list={[]} />} />
                    <TabPanel value={activeTab} index={5} id='p6' children={<RemoveSubtitle list={[]} />} />
                    <TabPanel value={activeTab} index={6} id='p7' children={<RemoveWatermark list={[]} />} />
                </ui.Box>
            </ui.Box>

            <footer style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, cursor: 'pointer', color: '#3e3e3e', fontSize: '8px' }}>
                <p>提示：建议框选水印时覆盖完整水印区域，避免遗漏边缘</p>
            </footer>
        </div>
    );
}
