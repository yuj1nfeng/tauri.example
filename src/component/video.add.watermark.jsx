import React from 'react';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import utils, { sse, tauri, consts, rules } from '../utils/index.js';
import ProgressBtn from './progress.btn.jsx';

const namespace = new URL(import.meta.url).pathname;
export default function ConcatVideos({ list }) {
    const [state, setState] = React.useState(utils.kv.withNamespace(namespace).get('state'));

    const [form] = ui.Form.useForm();
    const init = async () => {
        console.log(namespace + '\tinit');
        setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 }));
        if (state?.task_id) utils.sse.addEventListener(state.task_id, progressHandle);
        return () => {
            console.log('destory');
        };
    };

    React.useEffect(() => init, []);
    React.useEffect(() => { utils.kv.withNamespace(namespace).set('state')(state); }, [state]);


    const progressHandle = (data) => {
        const percent = Number(data);
        setState((prev) => ({ ...prev, percent: percent, processing: true }));
        if (parseInt(data) === 100) setState((prev) => ({ ...prev, 'processing': false, percent: 0, task_id: null }));
    };
    const setOutputDir = async (e) => {
        const result = await tauri.dialog.open({ directory: true });
        if (!result) return;
        form.setFieldsValue({ 'output_dir': result.replace(/\\/g, '/') });
    };

    const startHandle = async () => {
        const result = await form.validate();
        if (result != true) {
            ui.MessagePlugin.error(result[Object.keys(result)[0]][0].message);
            return;
        }
        const values = form.getFieldsValue(Object.keys(rules.videoAddWatermarkRules));
        setState((prev) => ({ ...prev, 'processing': true, percent: 0 }));
        values['videos'] = list;
        values['watermark'] = values['watermark'][0].url;
        const { task_id } = await utils.ext.invoke('video.add.watermark', values);
        setState((prev) => ({ ...prev, 'task_id': task_id }));
        utils.task.createTask(task_id, values, progressHandle);
        sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };

    const uploadHandle = async (e) => {
        console.log(e);
        const img_url = await utils.ext.imageToBase64(e[0].raw);
        form.setFieldsValue({ 'watermark': [{ url: img_url }] });
    };

    return (
        <ui.Form
            layout='inline'
            form={form}
            colon={true}
            rules={rules.videoAddWatermarkRules}
            showErrorMessage={false}
            initialData={state?.values}
            style={{ paddingTop: '10px' }}
            labelWidth={80}
            onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))
            }>
            <ui.Form.FormItem name='scale' label='缩放比例' children={<ui.InputNumber size='small' max={1} min={0.01} step={0.01} style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='opacity' label='不透明度' children={<ui.InputNumber size='small' max={1} min={0.1} step={0.1} style={{ width: '120px' }} />} />            <ui.Form.FormItem name='position' label='水印位置' children={<ui.Select size='small' options={consts.options.watermark_position} style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='output_fmt' label='输出格式' children={<ui.Select size='small' options={consts.options.video_output_fmt} style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='watermark' label='水印图片' children={<ui.Upload size='small' theme='image' accept='image/*' imageProps={{ fit: 'contain' }} autoUpload={false} onChange={uploadHandle} />} />
            <ui.Form.FormItem name='output_dir' label='输出目录' children={<ui.Input size='small' style={{ width: '480px' }} suffixIcon={<icon.FolderSettingFilledIcon cursor='pointer' onClick={setOutputDir} />} />} />

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
