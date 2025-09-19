
import React from 'react';
import { useRecoilState } from 'recoil';
import videosStore from '@/store/videos.atom.js';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import utils from '@/utils/index.js';
import useVideoService from '@/service/video.service.js';


export function VideoList({ style = {} }) {
    const [videos] = useRecoilState(videosStore);
    const videoService = useVideoService();
    React.useEffect(() => videoService.init, []);

    const renderItems = () => {
        if (!videos || videos.length === 0) return <ui.Empty />;
        return videos.map((item, index) => (
            <ui.List.ListItem
                key={item.id}
                // style={{ height: '100%' }}
                action={
                    <ui.Space  >
                        {!!item.thumbnail &&
                            <ui.Image
                                fit='contain'
                                shape='square'
                                src={item.thumbnail}
                                style={{ height: '100%', width: '48px', cursor: 'pointer', borderRadius: '8px' }}
                                overlayTrigger='hover'
                                overlayContent={<icon.PlayCircleIcon color='red' onClick={() => utils.ext.invoke('video.play', { input: item.filename })} />}
                            />}
                        <ui.Button variant="text" shape="square" size='small' onClick={() => videoService.remove(item.id)} icon={<icon.DeleteIcon />}></ui.Button>
                    </ui.Space>
                }>
                <ui.List.ListItemMeta
                    title={<span className='title' style={{ fontSize: '12px', fontFamily: 'consolas', textOverflow: 'hidden' }}>{item.title}</span>}
                    description={<span className='description' style={{ fontSize: '12px', textOverflow: 'hidden' }}>{item.description}</span>}
                />

            </ui.List.ListItem>
        ));
    };
    return (
        <ui.List size='small' style={{ ...style }} >
            {renderItems()}
        </ui.List>
    );
}


export default function VideoTable({ style = {} }) {
    const [videos] = useRecoilState(videosStore);
    const videoService = useVideoService();
    React.useEffect(() => videoService.init, []);


    const renderImg = ({ row }) => {
        const item = row;
        if (!item.thumbnail) return null;
        return <ui.Image
            fit='cover'
            shape='square'
            src={item.thumbnail}
            style={{ width: '64px', height: '36px', cursor: 'pointer', borderRadius: '8px' }}
            overlayTrigger='hover'
            overlayContent={<icon.PlayCircleIcon color='red' onClick={() => utils.ext.invoke('video.play', { input: item.filename })} />}
        />;
    };

    const columns = [
        { colKey: 'filename', title: '文件名', cell: renderImg, width: 120 },
        { colKey: 'filename', title: '文件名', ellipsis: true },
        { colKey: 'fmt_size', title: '文件大小', },
        { colKey: 'video.codec', title: '视频编码', },
        { colKey: 'audio.codec', title: '音频编码', },
        { colKey: 'fmt_duration', title: '时长', },
        {
            colKey: 'options', title: '操作', fixed: 'right', cell: ({ row }) =>
                <ui.Space size='small' align='end'>
                    <ui.Button variant="text" shape="square" size='small' icon={<icon.SettingIcon />} />
                    <ui.Button variant="text" shape="square" size='small' onClick={() => videoService.remove(row.id)} icon={<icon.DeleteIcon />} />
                </ui.Space>
        }
    ];
    return (
        <ui.Table
            showHeader={false}
            rowKey='id'
            className='table'
            hover={true}
            bordered={false}
            size='small'
            stripe={true}
            maxHeight={style.height}
            fixedRows={1}
            data={videos}
            columns={columns}
            style={{ ...style }} />
    );
}