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
    source = new EventSource(url);
    source.addEventListener(consts.events.error, (event) => ui.Message.error(event.data));
    source.addEventListener(consts.events.warning, (event) => ui.Message.warning(event.data));
    source.addEventListener(consts.events.info, (event) => ui.Message.info(event.data));
    source.addEventListener(consts.events.heartbeat, (event) => console.log('heartbeat', event.data));
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
