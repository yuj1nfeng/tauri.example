import * as ui from '@arco-design/web-react';
import consts from '#consts';

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
    console.log('create new event source');
    source = new EventSource(url);
    source.addEventListener('time-update', (event) => {
        const { data } = event;
        console.log('time-update', data);
        ui.Message.info(data);
    });

    source.addEventListener('connected', (event) => {
        const { data } = event;
        console.log('connected');
        ui.Message.success(data);
    });

    source.addEventListener(consts.events.success, (event) => {
        const { data } = event;
        console.log('success');
        ui.Message.success(data);
    });

    source.addEventListener(consts.events.error, (event) => {
        const { data } = event;
        console.log('error');
        ui.Message.error(data);
    });

    source.addEventListener(consts.events.info, (event) => {
        const { data } = event;
        console.log('info', data);
        ui.Message.info(data);
    });
    return source;
}

function check() {
    if (!source) getEventSource();
}

function addEventListener(type, callback) {
    getEventSource().addEventListener(type, (event) => callback(event.data));
}

function removeEventListener(type, callback) {
    getEventSource().removeEventListener(type, callback);
}

export default { check, addEventListener, removeEventListener, getEventSource };
