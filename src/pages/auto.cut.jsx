

import React from 'react';
import tauri from '../utils/tauri.js';
import service from '../utils/service.js';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';
import consts from '../../consts.js';
const { options } = consts;


export default function ConcatVideos({ list }) {
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);
    const [values, setValues] = React.useState({
        video_codec: 'h264',
        output_fmt: 'mp4',
        output_dir: '~/Videos',
        video_frame_rate: 15,
        video_bit_rate: 1000,
        video_size: '1920x1080',
        audio_codec: 'aac',
        audio_sample_rate: 44100,
        audio_channels: 2,
    });
    const [form] = ui.Form.useForm();

    const progressHandle = (event) => {
        setPercent(event.detail);
    };

    React.useEffect(() => {
        window.addEventListener('concat-progress', progressHandle);
        // return () => window.removeEventListener('concat-progress', progressHandle);
    }, []);




    const setOutputFile = async (e) => {
        const result = await tauri.dialog.save({ title: '请选择保存路径', defaultPath: `concat.${values.output_fmt}` });
        if (!result) return;
        form.setFieldValue('output_file', result.replaceAll('\\', '/'));
    };

    const startHandle = async () => {
        setProcessing(true);
        setPercent(0);
        const values = form.getFieldsValue();
        console.log('values', values);
        console.log('videos', list);
        values['videos'] = list;
        const result = await service.concatVideos(values);
        console.log('result', result);
        setProcessing(false);
        setPercent(100);

    };
    return (
        <ui.Form {...consts.formProps}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={percent} width='100%' style={{ display: processing ? 'inline-block' : 'none' }} />
            </ui.Grid.Col>

            <ui.Grid.Col span={24} children={<ui.Form.Item label='缩放比例' children={<ui.Input placeholder='缩放比例' />} />}>
                <ui.Form.Item
                    label='片段时长'
                    children={
                        <ui.Slider
                            placeholder='请选择片段时长'
                            range={true}
                            step={1}
                            min={5}
                            max={60}
                            defaultValue={[5, 10]}
                            formatTooltip={(number) => `${number} 秒`}
                            showInput={{ suffix: 's' }}
                            style={{ minWidth: '566px' }}
                        />
                    }
                />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input />} />}>
                <ui.Form.Item label='视频码率' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频帧率' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='画面宽高' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频编码' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input />} />}>
                <ui.Form.Item label='音频采样率' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频通道数' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频编码器' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input />} />}>
                <ui.Form.Item label='输出格式' children={<ui.Select autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='输出目录 ' children={<ui.Input autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button loading={processing} onClick={startHandle} type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}