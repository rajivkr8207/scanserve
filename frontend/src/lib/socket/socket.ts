
import { ENV } from "@/config/env";
import { io } from "socket.io-client";

const origin = ENV.NEXT_PUBLIC_API_URL
const socket = io(`${origin}`, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;