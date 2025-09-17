import React from 'react';
import utils, { tauri, consts, rules, sse } from '@/utils/index.js';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import ProgressBtn from '@/component/progress.btn.jsx';
const namespace = new URL(import.meta.url).pathname;
export default function ConcatVideos() {
    const [state, setState] = React.useState(utils.kv.withNamespace(namespace).get('state'));
    const [form] = ui.Form.useForm();
    const init = async () => {
        console.log(namespace + '\tinit');
        setState((prev) => ({ ...prev, processing: false, percent: 0 }));
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
        if (parseInt(data) === 100) setState((prev) => ({ ...prev, processing: false, percent: 0, task_id: null }));

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
        const values = form.getFieldsValue(Object.keys(rules.videoDownloadRules));
        setState((prev) => ({ ...prev, processing: true, percent: 0 }));
        values['videos'] = await utils.videoStore.getAll();
        const { task_id } = await utils.ext.invoke('video.download', values);
        setState((prev) => ({ ...prev, task_id: task_id }));
        utils.task.createTask(task_id, values, progressHandle);
        utils.sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };
    return (
        <ui.Form layout='inline'
            form={form}
            colon={true}
            rules={rules.videoDownloadRules}
            showErrorMessage={false}
            initialData={state?.values}
            style={{ paddingTop: '10px' }}
            labelWidth={80}
            onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))
            }>
            <ui.Form.FormItem name='browser' label='浏览器'
                children={<ui.Select size='small' options={consts.options.browser} style={{ width: '100px' }} />}
            />
            <ui.Form.FormItem name='output_dir' label='输出目录'
                children={<ui.Input
                    size='small'
                    placeholder='请选择输出目录'
                    style={{ width: '364px' }}
                    prefixIcon={<icon.FolderSettingIcon cursor='pointer' onClick={setOutputDir} />}
                />}
            />
            <ui.Form.FormItem name='url' label='视频链接'
                children={<ui.Input size='small' placeholder='请设置视频链接' style={{ width: '380px' }} />}
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
