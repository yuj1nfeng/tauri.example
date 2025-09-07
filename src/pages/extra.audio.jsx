

import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import socket from '../utils/socket.js';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
import consts from '../../consts.js';


export default function ({ list }) {
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({
        audio_output_fmt: 'mp3',
        audio_codec: 'mp3',
        audio_sample_rate: 44100,
        audio_channels: 2,
    });
    const [form] = ui.Form.useForm();

    const progressHandle = (event) => {
        setPercent(event.detail);
    };

    React.useEffect(() => {
        socket.check();
        window.addEventListener(consts.events.extra_audio_progeress, progressHandle);
        return () => window.removeEventListener(consts.events.extra_audio_progeress, progressHandle);
    }, []);




    const setOutputDir = async (e) => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        form.setFieldValue('output_dir', result.replace(/\\/g, '/'));
    };

    const startHandle = async () => {
        socket.check();
        const values = await form.validate();
        window.addEventListener(consts.events.extra_audio_progeress, progressHandle);
        setProcessing(true);
        setPercent(0);
        values['videos'] = list;
        const result = await service.extraAudio(values);
        window.removeEventListener(consts.events.extra_audio_progeress, progressHandle);
        setProcessing(false);
        setPercent(100);
    };
    return (
        <ui.Form {...consts.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={processing ? percent : 0} width='100%' style={{ display: processing ? 'block' : 'none' }} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} >
                <ui.Form.Item rules={[{ required: true, message: '请设置音频采样率' }]} field='audio_sample_rate' label='音频采样率' children={<ui.Input />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置音频通道数' }]} field='audio_channels' label='音频通道数' children={<ui.InputNumber />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置音频编码器' }]} field='audio_codec' label='音频编码器' children={<ui.Select options={consts.options.audio_codec} autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} >
                <ui.Form.Item rules={[{ required: true, message: '请设置输出格式' }]} field='audio_output_fmt' label='输出格式' children={<ui.Select options={consts.options.audio_output_fmt} autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置输出目录' }]} field='output_dir' label='输出目录' onClick={setOutputDir} children={<ui.Input autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button onClick={startHandle} type='primary' loading={processing} disabled={list.length === 0} style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}