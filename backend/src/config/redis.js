const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "ravishing-star-lovely-29159.db.redis.io",
    port: 18222
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

module.exports = redisClient;