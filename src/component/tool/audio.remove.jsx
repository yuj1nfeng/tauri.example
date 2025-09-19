import React from 'react';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import { useRecoilValue } from 'recoil';
import videosSelector from '@/store/videos.selector.js';
import ProgressBtn from '@/component/progress.btn.jsx';
import useTaskService from '@/service/task.service.js';
import utils, { tauri, consts, sse, rules } from '@/utils/index.js';

const namespace = new URL(import.meta.url).pathname;

export default function () {
    const taskService = useTaskService();
    const videos = useRecoilValue(videosSelector);
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
        const values = form.getFieldsValue(Object.keys(rules.audioRemoveRules));
        setState((prev) => ({ ...prev, processing: true, percent: 0 }));
        values['videos'] = videos;
        const task_id = await taskService.create('audio.remove', values, progressHandle);
        setState((prev) => ({ ...prev, task_id: task_id }));
        utils.sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };
    return (
        <ui.Form
            layout='inline'
            form={form}
            colon={true}
            initialData={state?.values}
            rules={rules.audioRemoveRules}
            showErrorMessage={false}
            style={{ paddingTop: '10px' }}
            labelWidth={80}
            onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))
            }>
            <ui.Form.FormItem name='output_fmt' label='输出格式' children={<ui.Select size='small' style={{ width: '120px' }} options={consts.options.video_output_fmt} />} />
            <ui.Form.FormItem name='output_dir' label='输出目录' children={<ui.Input size='small' style={{ width: '364px' }} prefixIcon={<icon.FolderSettingIcon cursor='pointer' onClick={setOutputDir} />} />} />

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