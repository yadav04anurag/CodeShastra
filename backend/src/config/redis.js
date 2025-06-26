const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11567.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11567
    }
});

module.exports = redisClient;