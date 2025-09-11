

import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import * as ui from '@arco-design/web-react';
import consts from '#consts';
const { options } = consts;


export default function ConcatVideos({ list }) {
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({
        video_codec: 'h264',
        output_fmt: 'mp4',
        output_dir: '~/Videos',
        video_frame_rate: 15,
        video_bit_rate: 1000,
        video_size: '1920x1080',
        audio_codec: 'aac',
        audio_sample_rate: 44100,
        audio_channels: 2,
    });
    const [form] = ui.Form.useForm();

    const progressHandle = (event) => {
        setPercent(event.detail);
    };

    React.useEffect(() => {
        window.addEventListener('concat-progress', progressHandle);
        // return () => window.removeEventListener('concat-progress', progressHandle);
    }, []);




    const setOutputFile = async (e) => {
        const result = await tauri.dialog.save({ title: '请选择保存路径', defaultPath: `concat.${values.output_fmt}` });
        if (!result) return;
        form.setFieldValue('output_file', result.replaceAll('\\', '/'));
    };
    const setOutputDir = async (e) => {
        const result = await tauri.dialog.open({ title: '请选择保存路径', directory: true });
        if (!result) return;
        form.setFieldValue('output_dir', result.replaceAll('\\', '/'));
    };

    const startHandle = async () => {
        setProcessing(true);
        setPercent(0);
        const values = form.getFieldsValue();
        console.log('values', values);
        console.log('videos', list);
        values['videos'] = list;
        const result = await service.concatVideos(values);
        console.log('result', result);
        setProcessing(false);
        setPercent(100);

    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} >
                <ui.Form.Item field='video_bit_rate' label='视频码率' children={<ui.Input />} />
                <ui.Form.Item field='video_frame_rate' label='视频帧率' children={<ui.InputNumber step={1} min={1} max={60} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} >
                <ui.Form.Item field='video_size' label='画面宽高' children={<ui.Input />} />
                <ui.Form.Item field='video_codec' label='视频编码' children={<ui.Select options={options.video_codec} autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} >
                <ui.Form.Item field='output_fmt' label='输出格式' children={<ui.Select options={options.video_output_fmt} autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item field='output_dir' label='输出目录 ' children={<ui.Input onClick={setOutputDir} autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button onClick={startHandle} type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}