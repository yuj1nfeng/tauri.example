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
        const { task_id } = await utils.ext.invoke('video.download', values);
        setState((prev) => ({ ...prev, task_id: task_id }));
        utils.task.createTask(task_id, values, progressHandle);
        utils.sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={state?.values} onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))}>
            <ui.Form.Item
                field='url'
                rules={[{ required: true, message: '请设置视频链接' }]}
                label='切片时长'
                children={<ui.Input placeholder='请设置视频链接' style={{ width: '380px' }} />}
            />

            <ui.Form.Item
                field='browser'
                rules={[{ required: true, message: '请设置cookie来源' }]}
                label='cookie源'
                children={<ui.Select options={consts.options.browser} autoWidth={{ minWidth: '380px' }} />}
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
                disabled={state?.processing || false}
                children={state?.processing ? '处理中' : '开始处理'}
                type='primary'
                style={{ width: '100%' }}
            />
        </ui.Form>
    );
}
