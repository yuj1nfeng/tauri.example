import React from 'react';
import utils, { tauri, consts, sse } from '../utils/index.js';
import * as ui from '@arco-design/web-react';
import dayjs from 'dayjs';
import ProgressBtn from './progress.btn.jsx';
const { options } = consts;

const namespace = new URL(import.meta.url).pathname;



export default function ConcatVideos({ list }) {
    const [state, setState] = React.useState(utils.kv.withNamespace(namespace).get('state'));
    const [form] = ui.Form.useForm();
    const init = async () => {
        console.log(namespace + '\tinit');
        sse.check();
        setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 }));
        const { task_id } = state;
        console.log('task_id:', task_id);
        if (!task_id) return;
        sse.addEventListener(task_id, progressHandle);
        return () => {
            console.log('destory');
        };
    };


    React.useEffect(() => init, []);
    React.useEffect(() => { utils.kv.withNamespace(namespace).set('state')(state); }, [state]);


    const progressHandle = (data) => {
        const percent = Number(data);
        setState((prev) => ({ ...prev, 'percent': percent }));
        if (parseInt(data) === 100) {
            utils.sse.removeEventListener(state.task_id, progressHandle);
            setState((prev) => ({ ...prev, 'processing': false, percent: 0, task_id: null }));
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
        setState((prev) => ({ ...prev, 'processing': true, percent: 0 }));
        values['videos'] = list;
        const file_name = `${dayjs().format('YYYYMMDDHHmmss')}.CONCAT.${values.output_fmt}`;
        values['output_file'] = `${values.output_dir}/${file_name}`;
        const { task_id } = await utils.ext.invoke('video.concat', values);
        setState((prev) => ({ ...prev, 'task_id': task_id }));
        sse.addEventListener(task_id, progressHandle);
        sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={state?.values} onValuesChange={(_, values) => setState((prev) => ({ ...prev, 'values': values }))}>
            <ui.Grid.Col span={8}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置视频码率' }]}
                    field='video_bit_rate'
                    label='视频码率'
                    children={<ui.Input autoWidth={{ minWidth: '180px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置视频帧率' }]}
                    field='video_frame_rate'
                    label='视频帧率'
                    children={<ui.Input autoWidth={{ minWidth: '180px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置视频编码' }]}
                    field='video_codec'
                    label='视频编码'
                    children={<ui.Select options={options.video_codec} autoWidth={{ minWidth: '180px' }} />}
                />
            </ui.Grid.Col>
            <ui.Grid.Col span={8}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置画面宽高' }]}
                    field='video_size'
                    label='输出大小'
                    children={<ui.Input autoWidth={{ minWidth: '180px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置输出格式' }]}
                    field='output_fmt'
                    label='输出格式'
                    children={<ui.Select options={options.video_output_fmt} autoWidth={{ minWidth: '180px' }} />}
                />
            </ui.Grid.Col>

            <ui.Grid.Col span={8}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置音频采样率' }]}
                    field='audio_sample_rate'
                    label='音频采样率'
                    children={<ui.Input autoWidth={{ minWidth: '180px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置音频通道数' }]}
                    field='audio_channels'
                    label='音频通道数'
                    children={<ui.InputNumber autoWidth={{ minWidth: '180px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置音频编码器' }]}
                    field='audio_codec'
                    label='音频编码器'
                    children={<ui.Select options={options.audio_codec} autoWidth={{ minWidth: '180px' }} />}
                />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置输出目录' }]}
                    field='output_dir'
                    label=' 输出目录'
                    onClick={setOutputDir}
                    children={<ui.Input autoWidth={{ minWidth: '260px' }} />}
                />
            </ui.Grid.Col>
            <ProgressBtn
                onClick={startHandle}
                size='small'
                loading={state?.processing || false}
                progress={state?.percent || 0}
                disabled={list.length === 0}
                children={state?.processing ? '处理中' : '开始处理'}
                type='primary'
                style={{ width: '100%' }}
            />
        </ui.Form>
    );
}
