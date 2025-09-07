

const pool = [];


function onMessage(event, socket) {
    console.log('message: ' + event.data);
    // socket.send('Server: ' + event.data);

    // // 广播消息给所有连接
    // pool.forEach(client => {
    //     if (client !== socket && client.readyState === WebSocket.OPEN) {
    //         client.send(`Broadcast: ${event.data}`);
    //     }
    // });
}

function onOpen(event, socket) {
    pool.push(socket);
    const pack = { type: 'connected', data: '服务器连接成功' };
    socket.send(JSON.stringify(pack));
}


function onClose(event, socket) {
    console.log('close');
    const pack = { type: 'disconnected', data: '与服务器断开连接' };
    socket.send(JSON.stringify(pack));
    //disconnected
    pool.splice(pool.indexOf(socket), 1);
}

function sendMessage(message) {
    pool.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

export default {
    sendMessage,
    handle: (c) => ({ onMessage, onOpen, onClose })
};


