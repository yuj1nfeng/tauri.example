
import * as ui from '@arco-design/web-react';
let socketInstance = null;

function createSocket() {
    // 如果已有活跃连接，直接返回
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
        return socketInstance;
    }

    // 如果正在连接中，也直接返回
    if (socketInstance && socketInstance.readyState === WebSocket.CONNECTING) {
        return socketInstance;
    }

    console.log('创建新的WebSocket连接');
    socketInstance = new WebSocket('ws://localhost:3000/ws');
    socketInstance.onmessage = (event) => {
        const { type, data } = JSON.parse(event.data);

        switch (type) {
            case 'connected':
                ui.Message.success(data);
                break;
            case 'success':
                ui.Message.success(data);
                break;
            case 'error':
                ui.Message.error(data);
                break;
            case 'info':
                ui.Message.info(data);
                break;
            case 'warning':
                ui.Message.warning(data);
                break;
            default:
                {
                    const customEvent = new CustomEvent(type, {
                        detail: data,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(customEvent);
                    window.dispatchEvent(customEvent);
                    break;
                }
        }
    };

    return socketInstance;
}

function check() {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) return;
    createSocket();
}

export default { check };