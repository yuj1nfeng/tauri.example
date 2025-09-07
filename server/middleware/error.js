
import socket from '../socket';
export default async (err, c) => {
    c.status(500);
    socket.sendMessage({ type: 'error', data: err.message });


    return c.json({ error: err.message });
};
