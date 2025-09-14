import React from 'react';
import * as ui from '@arco-design/web-react';
import utils, { sse, tauri, consts } from '../utils/index.js';
import ProgressBtn from './progress.btn.jsx';

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
        values['watermark'] = await utils.ext.imageToBase64(values['watermark_files'][0].originFile);
        const { task_id } = await utils.ext.invoke('video.add.watermark', values);
        setState((prev) => ({ ...prev, 'task_id': task_id }));
        sse.addEventListener(task_id, progressHandle);
        sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };

    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={state?.values} onValuesChange={(_, values) => setState((prev) => ({ ...prev, 'values': values }))}>
            <ui.Grid.Col span={6}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置水印图片' }]}
                    field='watermark_files'
                    label='水印图片'
                    children={<ui.Upload multiple={false} limit={1} autoUpload={false} listType='picture-card' />}
                />
            </ui.Grid.Col>
            <ui.Grid.Col span={6}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置缩放比例' }]}
                    field='scale'
                    label='缩放'
                    children={<ui.InputNumber max={1} min={0.01} step={0.01} style={{ width: '100px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置透明度' }]}
                    field='opacity'
                    label='透明'
                    children={<ui.InputNumber max={1} min={0.1} step={0.1} style={{ width: '100px' }} />}
                />
            </ui.Grid.Col>

            <ui.Grid.Col span={12}>
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置水印位置' }]}
                    field='position'
                    label='水印位置'
                    children={<ui.Select options={consts.options.watermark_position} autoWidth={{ minWidth: '260px' }} />}
                />
                <ui.Form.Item
                    rules={[{ required: true, message: '请设置视频编码' }]}
                    field='output_fmt'
                    label='输出格式'
                    children={<ui.Select options={consts.options.video_output_fmt} autoWidth={{ minWidth: '260px' }} />}
                />
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
