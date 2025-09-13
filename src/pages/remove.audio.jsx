import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import sse from '../utils/sse.js';
import * as ui from '@arco-design/web-react';
import consts from '#consts';
import ProgressBtn from './progress.btn.jsx';

export default function ({ list }) {
    const [currnet_task_id, setCurrentTaskId] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({ output_fmt: 'mp4', video_codec: 'mp4' });
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
        const { task_id } = await service.removeAudio(values);
        setCurrentTaskId(task_id);
        sse.addEventListener(task_id, progressHandle);
        sse.addEventListener(consts.events.error, () => setProcessing(false));
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Form.Item
                rules={[{ required: true, message: '请设置输出格式' }]}
                field='output_fmt'
                label='输出格式'
                children={<ui.Select options={consts.options.video_output_fmt} autoWidth={{ minWidth: '180px' }} />}
            />

            <ui.Form.Item
                rules={[{ required: true, message: '请设置输出目录' }]}
                field='output_dir'
                label='输出目录'
                onClick={setOutputDir}
                children={<ui.Input autoWidth={{ minWidth: '360px' }} />}
            />

            <ProgressBtn
                onClick={startHandle}
                size='small'
                loading={processing}
                progress={percent}
                disabled={list.length === 0}
                children={processing ? '处理中' : '开始处理'}
                type='primary'
                style={{ width: '100%' }}
            />
        </ui.Form>
    );
}
