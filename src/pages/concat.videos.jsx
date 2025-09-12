import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import sse from '../utils/sse.js';
import * as ui from '@arco-design/web-react';
import dayjs from 'dayjs';
import consts, { options } from '#consts';

export default function ConcatVideos({ list }) {
    const [currnet_task_id, setCurrentTaskId] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({
        video_codec: 'h264',
        output_fmt: 'mp4',
        video_frame_rate: 15,
        video_bit_rate: 1000,
        video_size: '1920x1080',
        audio_codec: 'aac',
        audio_sample_rate: 44100,
        audio_channels: 2,
    });
    const [form] = ui.Form.useForm();

    const progressHandle = (data) => {
        setPercent(data);
        if (parseInt(data) === 100) {
            setProcessing(false);
            sse.removeEventListener(currnet_task_id);
        }
    };

    const setOutputFile = async (e) => {
        const values = form.getFieldsValue();
        const output_fmt = values.output_fmt;
        const default_path = `${dayjs().format('YYYYMMDDHHmmss')}.concat.${output_fmt}`;
        const result = await tauri.dialog.save({ title: '请选择保存路径', defaultPath: default_path });
        if (!result) return;
        form.setFieldValue('output_file', result.replaceAll('\\', '/'));
    };

    const startHandle = async () => {
        sse.check();
        const values = await form.validate();
        setProcessing(true);
        setPercent(0);

        values['videos'] = list;
        const { task_id } = await service.concatVideos(values);
        setCurrentTaskId(task_id);
        form.setFieldValue('output_file', null);
        sse.addEventListener(task_id, progressHandle);
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={percent} width='100%' style={{ display: processing ? 'inline-block' : 'none' }} />
            </ui.Grid.Col>
            <ui.Grid.Col span={12}>
                <ui.Form.Item rules={[{ required: true, message: '请设置视频码率' }]} field='video_bit_rate' label='视频码率' children={<ui.Input />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置视频帧率' }]} field='video_frame_rate' label='视频帧率' children={<ui.Input />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置画面宽高' }]} field='video_size' label='画面宽高' children={<ui.Input />} />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置视频编码' }]}
                    field='video_codec'
                    label='视频编码'
                    children={<ui.Select options={options.video_codec} autoWidth={{ minWidth: '180px' }} />}
                />
            </ui.Grid.Col>

            <ui.Grid.Col span={12}>
                <ui.Form.Item rules={[{ required: true, message: '请设置音频采样率' }]} field='audio_sample_rate' label='音频采样率' children={<ui.Input />} />
                <ui.Form.Item rules={[{ required: true, message: '请设置音频通道数' }]} field='audio_channels' label='音频通道数' children={<ui.InputNumber />} />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置音频编码器' }]}
                    field='audio_codec'
                    label='音频编码器'
                    children={<ui.Select options={options.audio_codec} autoWidth={{ minWidth: '180px' }} />}
                />
            </ui.Grid.Col>
            <ui.Grid.Col span={8}>
                ``
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置输出格式' }]}
                    field='output_fmt'
                    label='输出格式'
                    children={<ui.Select options={options.video_output_fmt} autoWidth={{ minWidth: '180px' }} />}
                />
                <ui.Form.Item rules={[{ required: true, message: '请设置输出文件' }]} field='output_file' label='输出文件 ' children={<ui.Input onClick={setOutputFile} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button onClick={startHandle} loading={processing} disabled={processing || list.length === 0} type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}
