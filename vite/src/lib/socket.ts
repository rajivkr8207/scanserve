import { io, Socket } from 'socket.io-client';
import { Env } from '../config/Config';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(Env.Backend_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
