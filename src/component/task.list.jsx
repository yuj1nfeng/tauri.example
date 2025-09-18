
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import tasksSorted from '@/store/tasks.sorted.js';
import tasksAtom from '@/store/tasks.atom.js';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import utils from '@/utils/index.js';
import useTaskService from '@/service/task.service.js';


export default function ({ style = {} }) {
    const tasks = useRecoilValue(tasksSorted);
    const taskService = useTaskService();
    React.useEffect(() => taskService.init, []);


    const renderTaskType = ({ row }) => {
        const { type } = row;
        switch (type) {
            case 'video.split':
                return <ui.Tag size='small'>{'视频切片'}</ui.Tag>;
            case 'video.concat':
                return <ui.Tag size='small'>{'视频合并'}</ui.Tag>;
            case 'video.add.watermark':
                return <ui.Tag size='small'>{'添加水印'}</ui.Tag>;
            case 'video.add.subtitle':
                return <ui.Tag size='small'>{'添加字幕'}</ui.Tag>;
            case 'audio.extra':
                return <ui.Tag size='small'>{'音频提取'}</ui.Tag>;
            case 'audio.remove':
                return <ui.Tag size='small'>{'音频去除'}</ui.Tag>;
            case 'video.auto.cut':
                return <ui.Tag size='small'>{'自动混剪'}</ui.Tag>;
            case 'video.download':
                return <ui.Tag size='small'>{'视频下载'}</ui.Tag>;
            default:
                return '未知';
        }
    };
    const renderTaskStatus = ({ row }) => {
        const { status } = row;
        switch (status) {
            case 'created':
                return <ui.Tag size='small'>{'已创建'}</ui.Tag>;
            case 'running':
                return <ui.Tag size='small'>{'运行中'}</ui.Tag>;
            case 'completed':
                return <ui.Tag size='small'>{'已完成'}</ui.Tag>;
            case 'finished':
                return <ui.Tag size='small'>{'已完成'}</ui.Tag>;
            default:
                return <ui.Tag size='small'>{'未知'}</ui.Tag>;
        }
    };

    const renderTaskProgress = ({ row }) => {
        const { progress } = row;
        return <ui.Progress style={{ width: 120 }} size='small' percentage={progress} />;
    };
    const columns = [
        { colKey: 'id', title: '任务ID', },
        { colKey: 'type', title: '任务类型', cell: renderTaskType },
        { colKey: 'create_time', title: '创建时间', },
        { colKey: 'progress', title: '任务进度', cell: ({ row }) => <ui.Progress style={{ width: 120 }} percentage={row.progress} /> },
        { colKey: 'status', title: '任务状态', cell: renderTaskStatus },
        {
            colKey: 'options', title: '操作', fixed: 'right', cell: ({ row }) =>
                <ui.Space size='small' align='end'>
                    <ui.Button variant="text" shape="square" size='small' icon={<icon.DownloadIcon />} />
                    <ui.Button variant="text" shape="square" size='small' icon={<icon.RefreshIcon />} />
                    <ui.Button variant="text" shape="square" size='small' icon={<icon.Delete1FilledIcon onClick={() => taskService.remove(row.id)} />} />
                </ui.Space>
        }

    ];
    return (
        <ui.Table
            rowKey='id'
            className='table'
            bordered={false}
            hover={true}
            size='small'
            stripe={true}
            maxHeight={style.height}
            fixedRows={1}
            data={tasks}
            columns={columns}
            style={{ ...style }} />);
};