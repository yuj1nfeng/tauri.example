
import * as ui from '@arco-design/web-react';

const url = 'http://localhost:3000/sse';
let source = null;


function getEventSource() {
    // 如果已有活跃连接，直接返回
    if (source && source.readyState === EventSource.OPEN) {
        return source;
    }

    // 如果正在连接中，也直接返回
    if (source && source.readyState === EventSource.CONNECTING) {
        return source;
    }

    console.log('创建新的sset连接');
    source = new EventSource(url);
    source.addEventListener('time-update', (event) => {
        const { data } = event;
        console.log('test');
        ui.Message.success(data);
    });

    source.addEventListener('connected', (event) => {
        const { data } = event;
        console.log('connected');
        ui.Message.success(data);
    });

    source.addEventListener('success', (event) => {
        const { data } = event;
        console.log('success');
        ui.Message.success(data);
    });

    source.addEventListener('error', (event) => {
        const { data } = event;
        console.log('error');
        ui.Message.error(data);
    });

    source.addEventListener('info', (event) => {
        const { data } = event;
        console.log('info');
        ui.Message.info(data);
    });
    return source;
}

function check() {
    if (!source) getEventSource();
}


function addEventListener(type, callback) {
    getEventSource();
    source.addEventListener(type, (event) => {
        const { data } = event;
        console.log(type);
        ui.Message.info(data);
    });
}

function removeEventListener(type, callback) {
    source.removeEventListener(type, callback);
}


export default { check, addEventListener, removeEventListener, getEventSource };