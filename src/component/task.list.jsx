
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import tasksSorted from '@/store/tasks.sorted.js';
import tasksAtom from '@/store/tasks.atom.js';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import utils from '@/utils/index.js';
import useTaskService from '@/service/task.service.js';
import ProgressBar from '@/component/progress.bar.jsx';


export default function ({ style = {} }) {
    const tasks = useRecoilValue(tasksSorted);
    const taskService = useTaskService();
    React.useEffect(() => taskService.init, []);
    const tag = (text, color = 'primary') => {
        return <span className={`text-${color}-500 inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 `}>{text}</span>;
    };

    const typeTagMap = {
        'video.split': '视频分割',
        'video.concat': '视频合并',
        'video.add.watermark': '添加水印',
        'video.add.subtitle': '添加字幕',
        'audio.extra': '音频提取',
        'audio.remove': '音频去除',
        'video.auto.cut': '自动分割',
        'video.download': '下载视频'
    };
    const statusTagMap = {
        'created': '已创建',
        'running': '运行中',
        'completed': '已完成',
        'failed': '失败',
        'cancelled': '已取消',
    };

    const renderTaskType = ({ row }) => {
        const { type } = row;
        const tagText = typeTagMap[type];
        return tagText ? tag(tagText) : '未知';
    };
    const renderTaskStatus = ({ row }) => {
        const { status } = row;
        switch (status) {
            case 'created':
                return tag('已创建', 'gray');
            case 'running':
                return tag('运行中', 'blue');
            case 'completed':
                return tag('已完成', 'green');
            case 'failed':
                return tag('失败', 'red');
            case 'cancelled':
                return tag('已取消', 'gray');
            default:
                return '未知';
        }
    };

    const renderTaskProgress = ({ row }) => {
        const { progress } = row;
        return <ProgressBar percentage={progress} height='14px' />;
    };
    const columns = [
        { colKey: 'id', title: '任务ID', },
        { colKey: 'type', title: '任务类型', cell: renderTaskType },
        { colKey: 'create_time', title: '创建时间', },
        { colKey: 'progress', title: '任务进度', cell: renderTaskProgress },
        { colKey: 'status', title: '任务状态', cell: renderTaskStatus },
        {
            colKey: 'options', title: '操作', fixed: 'right', cell: ({ row }) =>
                <ui.Space size='small' align='end'>
                    <ui.Button variant="text" shape="square" size='small' icon={<icon.DownloadIcon />} />
                    <ui.Button variant="text" shape="square" size='small' icon={<icon.RefreshIcon onClick={() => taskService.retry(row.id)} />} />
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