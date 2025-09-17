import React from 'react';
import utils, { tauri, consts, sse, rules } from '../../utils/index.js';
import * as ui from 'tdesign-react';
import * as icon from 'tdesign-icons-react';
import { useRecoilValue } from 'recoil';
import videosSelector from '../../store/videos.selector.js';
import dayjs from 'dayjs';
import ProgressBtn from '../progress.btn.jsx';
const { options } = consts;
const namespace = new URL(import.meta.url).pathname;

export default function ConcatVideos({ list }) {
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
        const values = form.getFieldsValue(Object.keys(rules.videoConcatRules));
        setState((prev) => ({ ...prev, 'processing': true, percent: 0 }));
        values['videos'] = videos;
        const file_name = `${dayjs().format('YYYYMMDDHHmmss')}.concat.${values.output_fmt}`;
        values['output_file'] = `${values.output_dir}/${file_name}`;
        const { task_id } = await utils.ext.invoke('video.concat', values);
        setState((prev) => ({ ...prev, 'task_id': task_id }));
        utils.task.createTask(task_id, values, progressHandle);
        sse.addEventListener(consts.events.error, () => setState((prev) => ({ ...prev, 'processing': false, 'percent': 0 })));
    };


    return (
        <ui.Form
            layout='inline'
            form={form}
            colon={true}
            initialData={state?.values}
            style={{ paddingTop: '10px' }}
            rules={rules.videoConcatRules}
            showErrorMessage={false}
            labelWidth='100px'
            onValuesChange={(_, values) => setState((prev) => ({ ...prev, values: values }))
            }>
            <ui.Form.FormItem name='fps' label='视频帧率' children={<ui.InputNumber size='small' suffix='FPS' theme="column" style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='video_codec' label='视频编码器' children={<ui.Select size='small' options={options.video_codec} style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='audio_codec' label='音频编码器' children={<ui.Select size='small' options={options.audio_codec} style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='output_fmt' label='输出格式' children={<ui.Select size='small' options={options.video_output_fmt} style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='scale_width' label='画面宽度' children={<ui.InputNumber size='small' theme="column" style={{ width: '120px' }} />} />
            <ui.Form.FormItem name='scale_height' label='画面高度' children={<ui.InputNumber size='small' theme="column" style={{ width: '120px' }} />} />
            <ui.Form.FormItem
                name='output_dir'
                label='输出目录'
                children={<ui.Input
                    size='small'
                    placeholder='请选择输出目录'
                    style={{ width: '364px' }}
                    prefixIcon={<icon.FolderSettingIcon cursor='pointer' onClick={setOutputDir} />}
                />}
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
