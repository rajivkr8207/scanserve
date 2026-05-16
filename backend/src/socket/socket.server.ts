import { Server } from 'socket.io'
import { handleSocketChat } from './chat.socket.js';
import { ENV } from '../config/env.js';
import logger from '../config/logger.js';


let io: any;
export function initSocket(httpServer: any) {
    io = new Server(httpServer, {
        cors: {
            origin: ENV.FRONTEND_URL,
            credentials: true
        }
    })

    logger.info(`socket io server is running`);
    io.on('connection', (socket: any) => {
        logger.info(`user is connected`, socket.id);


        handleSocketChat(socket);

        socket.on("disconnect", () => {
            logger.info("User disconnected:", socket.id);
        });
    })
}


export function getIO() {
    if (!io) {
        throw new Error("socket.io not initialized")
    }
    return io
}