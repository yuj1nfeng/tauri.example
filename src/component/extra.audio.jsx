import React from 'react';
import * as ui from '@arco-design/web-react';
import ProgressBtn from './progress.btn.jsx';
import utils, { tauri, consts, sse } from '../utils/index.js';

const namespace = new URL(import.meta.url).pathname;

export default function ({ list }) {
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
    React.useEffect(() => {
        utils.kv.withNamespace(namespace).set('state')(state);
    }, [state]);

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
        const { task_id } = await utils.ext.invoke('audio.extra', values);
        setState((prev) => ({ ...prev, task_id: task_id }));
        utils.task.createTask(task_id, values, progressHandle);
        utils.sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={state?.values} onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))}>
            <ui.Form.Item
                rules={[{ required: true, message: '请设置输出格式' }]}
                field='output_fmt'
                label='输出格式'
                children={<ui.Select options={consts.options.audio_output_fmt} autoWidth={{ minWidth: '180px' }} />}
            />

            <ui.Form.Item rules={[{ required: true, message: '请设置输出目录' }]} field='output_dir' label='输出目录' onClick={setOutputDir} children={<ui.Input autoWidth={{ minWidth: '360px' }} />} />

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
