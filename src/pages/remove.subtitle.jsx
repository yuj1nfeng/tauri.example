

import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
import consts from '../../consts.js';
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
        <ui.Form {...consts.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />{' '}
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='字幕位置' children={<ui.Input placeholder='请依次输入(x,y,w,h),使用逗号或者空格区分' />} />
                <ui.Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='输出目录' children={<ui.Input placeholder='请选择输出目录' defaultValue='~/Videos' />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}