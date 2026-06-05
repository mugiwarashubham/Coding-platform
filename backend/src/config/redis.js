const {createClient}=require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-17656.c12.us-east-1-4.ec2.cloud.redislabs.com',
        port: 17656
    }
});
module.exports=redisClient;     