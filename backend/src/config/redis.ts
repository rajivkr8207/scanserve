import { Redis } from "ioredis";
import { ENV } from "./env.js";

const redis = new Redis({
    host: ENV.REDIS_HOST || "127.0.0.1",
    port: parseInt(ENV.REDIS_PORT as string, 10) || 6379,
    password: ENV.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
})
// 
redis.on("connect", () => {
    console.log(`server is connected to redis`);
})

redis.on('error', (err: any) => {
    console.log(err);
})


export default redis;