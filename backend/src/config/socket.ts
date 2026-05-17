import { Server } from "socket.io";

let io: any;

export const initSocket = (server: any) => {

    io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    });

    return io;
};

export const getIO = () => io;