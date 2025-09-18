
import React from 'react';
import { useRecoilState } from 'recoil';
import videosStore from '@/store/videos.atom.js';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import utils from '@/utils/index.js';
import useVideoService from '@/service/video.service.js';


export default function VideoList() {
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
        <ui.List size='small' style={{ height: '34vh', padding: '0 10px', border: '1px solid #c6c6c6', borderRadius: '8px' }} >
            {renderItems()}
        </ui.List>
    );
}