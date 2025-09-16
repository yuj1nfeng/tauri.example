import React from 'react';
import utils, { tauri, consts, sse } from '../utils/index.js';
import * as ui from '@arco-design/web-react';
import ProgressBtn from './progress.btn.jsx';
const namespace = new URL(import.meta.url).pathname;
export default function ConcatVideos({ list }) {
    const [state, setState] = React.useState(utils.kv.withNamespace(namespace).get('state'));
    const [form] = ui.Form.useForm();
    const init = async () => {
        console.log(namespace + '\tinit');
        setState((prev) => ({ ...prev, processing: false, percent: 0 }));
        return () => {
            console.log('destory');
        };
    };
    React.useEffect(() => init, []);
    React.useEffect(() => { utils.kv.withNamespace(namespace).set('state')(state); }, [state]);

    const progressHandle = (data) => {
        const percent = Number(data);
        setState((prev) => ({ ...prev, percent: percent }));
        if (parseInt(data) === 100) setState((prev) => ({ ...prev, processing: false, percent: 0, task_id: null }));

    };
    const setOutputDir = async (e) => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        form.setFieldValue('output_dir', result.replace(/\\/g, '/'));
    };

    const startHandle = async () => {
        const values = await form.validate();
        setState((prev) => ({ ...prev, processing: true, percent: 0 }));
        values['videos'] = list;
        const { task_id } = await utils.ext.invoke('video.split', values);
        setState((prev) => ({ ...prev, task_id: task_id }));
        utils.task.createTask(task_id, values, progressHandle);
        utils.sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={state?.values} onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))}>
            <ui.Form.Item
                field='split_duration'
                rules={[{ required: true, message: '请设置输出目录' }]}
                label='切片时长'
                children={<ui.Slider placeholder='请选择切片时长' step={5} min={5} max={150} defaultValue={60} formatTooltip={(number) => `${number} 秒`} style={{ width: '240px' }} />}
            />

            <ui.Form.Item
                field='output_dir'
                rules={[{ required: true, message: '请设置输出目录' }]}
                label='输出目录'
                children={<ui.Input onClick={setOutputDir} placeholder='请选择输出目录' defaultValue='~/Videos' style={{ width: '380px' }} />}
            />
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
