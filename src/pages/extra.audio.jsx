

import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import sse from '../utils/sse.js';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
import consts from '#consts';


export default function ({ list }) {
    const [currnet_task_id, setCurrentTaskId] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({
        audio_output_fmt: 'mp3',
        audio_codec: 'mp3',
        audio_sample_rate: 44100,
        audio_channels: 2,
    });
    const [form] = ui.Form.useForm();

    const progressHandle = (data) => {
        setPercent(data);
        if (parseInt(data) === 100) {
            sse.removeEventListener(currnet_task_id, progressHandle);
            setProcessing(false);
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
        const { task_id } = await service.extraAudio(values);
        setCurrentTaskId(task_id);
        sse.addEventListener(task_id, progressHandle);
    };
    return (
        <ui.Form {...consts.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={processing ? percent : 0} width='100%' style={{ display: processing ? 'block' : 'none' }} />
            </ui.Grid.Col>


            <ui.Form.Item rules={[{ required: true, message: '请设置输出格式' }]} field='audio_output_fmt' label='输出格式' children={<ui.Select options={consts.options.audio_output_fmt} autoWidth={{ minWidth: '180px' }} />} />

            <ui.Form.Item rules={[{ required: true, message: '请设置输出目录' }]} field='output_dir' label='输出目录' onClick={setOutputDir} children={<ui.Input autoWidth={{ minWidth: '360px' }} />} />

            <ui.Grid.Col span={24}>
                <ui.Button onClick={startHandle} type='primary' loading={processing} disabled={list.length === 0} style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}