import React from 'react';
import tauri from './utils/tauri.js';
import * as ui from '@arco-design/web-react';
import * as icon from '@arco-design/web-react/icon';

const dataSource = new Array(400).fill({
    title: 'C:/Users/Administrator/Videos/2027-09-87 下载.MP4',
    description: '视频时长:35:09\t视频编码:h264\t音频编码:h264\t视频尺寸:1920*1080\t文件大小:90MB\t最后修改时间:2025-08-08 23:08:17',
    progress: Math.ceil(Math.random() * 70),
});
// 视频去水印组件

export default function () {
    const [list, setList] = React.useState([]);

    React.useEffect(() => {
        // document.body.setAttribute('arco-theme', 'dark');
        setList([...dataSource]);
    }, []);

    const uploadFiles = async () => {
        setList(dataSource);
        const result = await tauri.dialog.open({ directory: true });
        if (result) await tauri.dialog.message(`您选择了目录:\n${result}`, { buttons: 'Ok', title: '提示', kind: 'info' });
    };

    const clearFiles = () => {
        setList([]);
    };

    const render = (item, index) => (
        <ui.List.Item
            style={{ margin: 0, padding: 0, fontSize: '10px', fontWeight: 'bold' }}
            key={index}
            actions={[
                <ui.Progress size='mini' percent={item.progress} style={{ width: '100%' }} />,
                <ui.Button shape='circle' size='mini' icon={<icon.IconEdit />} />,
                <ui.Button shape='circle' size='mini' icon={<icon.IconDelete />} />,
            ]}
        >
            <ui.List.Item.Meta avatar={<ui.Avatar shape='square'>A</ui.Avatar>} title={item.title} description={item.description} />
        </ui.List.Item>
    );
    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 2em', fontSize: '12px', fontFamily: 'sans-serif' }}>
            <header style={{ textAlign: 'center' }}>
                <h3>🍉🍉创作者工具箱🍉🍉</h3>
            </header>

            <main className='main'>
                <ui.Space size='mini' style={{ marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
                    <ui.Button size='mini' onClick={uploadFiles} icon={<icon.IconUpload />}></ui.Button>
                    <ui.Button size='mini' onClick={clearFiles} icon={<icon.IconDelete />}></ui.Button>
                </ui.Space>
                <ui.List size='small' style={{ height: '34vh', padding: '0 20px' }} dataSource={list} render={render} />
                <ui.Tabs defaultActiveTab='7'>
                    <ui.Tabs.TabPane key='1' title='去除字幕'>
                        <RemoveSubtitle />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='2' title='去除水印'>
                        <RemoveWatermark />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='3' title='视频切片'>
                        <SplitVideos />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='4' title='添加水印'>
                        <AddWatermark />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='5' title='视频拼接'>
                        <ConcatVideos />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='6' title='音频提取'>
                        <ExtraAudio />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='7' title='音频去除'>
                        <RemoveAudio />
                    </ui.Tabs.TabPane>
                    <ui.Tabs.TabPane key='8' title='自动混剪'>
                        <AutoCut />
                    </ui.Tabs.TabPane>
                </ui.Tabs>
            </main>
            <footer style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, cursor: 'pointer', color: '#3e3e3e', fontSize: '8px' }}>
                <p>提示：建议框选水印时覆盖完整水印区域，避免遗漏边缘</p>
            </footer>
        </div>
    );
}

const formProps = {
    layout: 'inline', //
    labelAlign: 'left',
    size: 'mini',
    style: { width: '100%', height: '100%' },
    colon: true,
};

function RemoveWatermark(opts = { list }) {
    return (
        <ui.Form {...formProps} layout='horizontal'>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />{' '}
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='水印位置' children={<ui.Input placeholder='请依次输入(x,y,w,h),使用逗号或者空格区分' />} />
                <ui.Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='输出目录' children={<ui.Input placeholder='请选择输出目录' defaultValue='~/Videos' />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function RemoveSubtitle(opts = { list }) {
    return (
        <ui.Form {...formProps} layout='horizontal'>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />{' '}
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='字幕位置' children={<ui.Input placeholder='请依次输入(x,y,w,h),使用逗号或者空格区分' />} />
                <ui.Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='输出目录' children={<ui.Input placeholder='请选择输出目录' defaultValue='~/Videos' />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function SplitVideos(opts = { list }) {
    return (
        <ui.Form {...formProps} layout='horizontal'>
            <ui.Form.Item wrapperCol={{ span: 24, offset: 0 }}>
                <ui.Progress percent={30} width='100%' />
            </ui.Form.Item>
            <ui.Form.Item label='切片时长' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                <ui.Slider placeholder='请选择切片时长' step={5} min={5} max={150} defaultValue={60} formatTooltip={(number) => `${number} 秒`} showInput={{ suffix: 's' }} />
            </ui.Form.Item>
            <ui.Form.Item label='输出目录' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                <ui.Input placeholder='请选择输出目录' defaultValue='~/Videos' />
            </ui.Form.Item>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function ConcatVideos(opts = { list }) {
    return (
        <ui.Form {...formProps}>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='视频码率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频帧率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='画面宽高' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频编码' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='音频采样率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频通道数' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频编码器' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='输出格式' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='输出目录 ' children={<ui.Input defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function ExtraAudio(opts = { list }) {
    return (
        <ui.Form {...formProps}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />{' '}
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='音频采样率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频通道数' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频编码器' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='输出格式' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='输出目录 ' children={<ui.Input defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function RemoveAudio(opts = { list }) {
    return (
        <ui.Form {...formProps}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />{' '}
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='视频码率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频帧率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='画面宽高' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频编码' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='输出格式' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='输出目录 ' children={<ui.Input defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function AddWatermark(opts = { list }) {
    return (
        <ui.Form {...formProps} labelCol={{ span: 2, offset: 0 }} wrapperCol={{ span: 4, offset: 0 }}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={30} width='100%' />{' '}
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input placeholder='缩放比例' defaultValue='' />} />}>
                <ui.Form.Item label='水印图片' children={<ui.Upload multiple={false} limit={1} autoUpload={false} listType='picture-card' />} />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='视频码率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频帧率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='画面宽高' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频编码' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='音频采样率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频通道数' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频编码器' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label=' 输 出 目 录 ' children={<ui.Input defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}

function AutoCut(opts = {}) {
    const [processing, setProcessing] = React.useState(false);
    const [percent, setPercent] = React.useState([]);

    const handle = async () => {
        setProcessing(true);
        for (let i = 1; i <= 100; i++) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setPercent(i);
        }
        setProcessing(false);
        // ui.Message.success('操作已完成');
        ui.Modal.success({ title: '操作已完成', content: '文件已保存至 C:/Users/Administrator/Videos/output.mp4' });
    };

    return (
        <ui.Form {...formProps}>
            <ui.Grid.Col span={24}>
                <ui.Progress percent={percent} width='100%' style={{ display: processing ? 'inline-block' : 'none' }} />
            </ui.Grid.Col>

            <ui.Grid.Col span={24} children={<ui.Form.Item label='缩放比例' children={<ui.Input placeholder='缩放比例' defaultValue='' />} />}>
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

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='视频码率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频帧率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='画面宽高' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='视频编码' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>

            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='音频采样率' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频通道数' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='音频编码器' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={8} children={<ui.Form.Item label='缩放比例' children={<ui.Input defaultValue='' />} />}>
                <ui.Form.Item label='输出格式' children={<ui.Select defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
                <ui.Form.Item label='输出目录 ' children={<ui.Input defaultValue='' autoWidth={{ minWidth: '180px' }} />} />
            </ui.Grid.Col>
            <ui.Grid.Col span={24}>
                <ui.Button loading={processing} onClick={handle} type='primary' style={{ width: '100%' }}>
                    开始处理
                </ui.Button>
            </ui.Grid.Col>
        </ui.Form>
    );
}
