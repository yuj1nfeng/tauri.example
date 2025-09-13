import React from 'react';
import tauri from '../utils/tauri.js';
import utils from '../utils/index.js';
import * as ui from '@arco-design/web-react';
import consts from '#consts';
import ProgressBtn from './progress.btn.jsx';

export default function ConcatVideos({ list }) {
    const [currnet_task_id, setCurrentTaskId] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({ split_duration: 60 });
    const [form] = ui.Form.useForm();

    const progressHandle = (data) => {
        console.log(data);
        setPercent(data);
        if (parseInt(data) === 100) {
            setProcessing(false);
            utils.sse.removeEventListener(currnet_task_id, progressHandle);
        }
    };
    const setOutputDir = async (e) => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        form.setFieldValue('output_dir', result.replace(/\\/g, '/'));
    };

    const startHandle = async () => {
        utils.sse.check();
        const values = await form.validate();
        setProcessing(true);
        setPercent(0);
        values['videos'] = list;
        const { task_id } = await utils.service.splitVideos(values);
        setCurrentTaskId(task_id);
        utils.sse.addEventListener(task_id, progressHandle);
        utils.sse.addEventListener(consts.events.error, () => setProcessing(false));
    };
    return (
        <ui.Form {...consts.config.formProps} form={form} initialValues={values} onValuesChange={setValues}>
            <ui.Form.Item
                field='split_duration'
                rules={[{ required: true, message: '请设置输出目录' }]}
                label='切片时长'
                children={
                    <ui.Slider placeholder='请选择切片时长' step={5} min={5} max={150} defaultValue={60} formatTooltip={(number) => `${number} 秒`} style={{ width: '240px' }} />
                }
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
