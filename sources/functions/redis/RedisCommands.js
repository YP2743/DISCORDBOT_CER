const {createClient} =require('redis'); 
require("dotenv").config();

let redisClient; 
let isReady = false;

async function getRedisClient() {
    if (!isReady) {
        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', err => console.log(`Redis Error: ${err}`));
        redisClient.on('connect', () => console.log('Redis connected'));
        redisClient.on('reconnecting', () => console.log('Redis reconnecting'));
        redisClient.on('ready', () => {
            isReady = true;
        });
        await redisClient.connect();
    }

    return redisClient;
}

async function cacheValueWithEx(key, value, time) {
    redisClient.setEx(key,time,value);
    let data = await redisClient.get(key);
    return data;
}

async function getCache(key) {
    let data = await redisClient.get(key);
    return data;
}

module.exports = {
    getRedisClient,
    cacheValueWithEx,
    getCache,
}