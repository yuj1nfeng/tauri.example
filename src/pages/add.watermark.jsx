

import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import sse from '../utils/sse.js';
import * as ui from '@arco-design/web-react';
import consts from '#consts';
import ProgressBtn from './progress.btn.jsx';

export default function ConcatVideos({ list }) {
    const [currnet_task_id, setCurrentTaskId] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({ video_codec: 'h264', output_fmt: 'mp4', position: 'left-top', scale: 0.2, opacity: 0.5 });
    const [form] = ui.Form.useForm();

    const progressHandle = (data) => {
        setPercent(data);
        if (parseInt(data) === 100) {
            setProcessing(false);
            sse.removeEventListener(currnet_task_id);
        }
    };
    const setOutputDir = async (e) => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        form.setFieldValue('output_dir', result.replace(/\\/g, '/'));
    };

    const startHandle = async () => {
        sse.check();
        const values = await form.validate();
        setProcessing(true);
        setPercent(0);

        values['videos'] = list;
        values['watermark'] = values['watermark_files'][0];
        const { task_id } = await service.addWatermark(values);
        setCurrentTaskId(task_id);
        sse.addEventListener(task_id, progressHandle);
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Grid.Col span={6}>
                <ui.Form.Item rules={[{ required: true, message: '请设置水印图片' }]} field='watermark_files' label='水印图片' children={<ui.Upload multiple={false} limit={1} autoUpload={false} listType='picture-card' />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={6}>
                <ui.Form.Item rules={[{ required: true, message: '请设置缩放比例' }]} field='scale' label='缩放' children={<ui.InputNumber max={1} min={0.01} step={0.01} style={{ width: '100px' }} />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置透明度' }]} field='opacity' label='透明' children={<ui.InputNumber max={1} min={0.1} step={0.1} style={{ width: '100px' }} />} />
            </ui.Grid.Col>

            <ui.Grid.Col span={12}>
                <ui.Form.Item rules={[{ required: true, message: '请设置水印位置' }]} field='position' label='水印位置' children={<ui.Select options={consts.options.watermark_position} autoWidth={{ minWidth: '260px' }} />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置视频编码' }]} field='output_fmt' label='输出格式' children={<ui.Select options={consts.options.video_output_fmt} autoWidth={{ minWidth: '260px' }} />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置输出目录' }]} field='output_dir' label=' 输出目录' onClick={setOutputDir} children={<ui.Input autoWidth={{ minWidth: '260px' }} />} />
            </ui.Grid.Col>
            <ProgressBtn
                onClick={startHandle}
                size='small'
                loading={processing}
                progress={percent}
                disabled={list.length === 0}
                children={processing ? '处理中' : '开始处理'}
                type='primary'
                style={{ width: '100%' }} />
        </ui.Form>
    );
}