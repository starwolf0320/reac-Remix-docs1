import type { Redis as RedisType } from "ioredis";
import Redis from "ioredis";

import config from "~/config";

let redis: RedisType;

declare global {
  var __redis: RedisType | undefined;
}

const redisOptions: Redis.RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the Redis with every change either.
if (process.env.NODE_ENV === "production") {
  redis = new Redis(config.redis_url, redisOptions);
} else {
  if (!global.__redis) {
    global.__redis = new Redis(config.redis_url, redisOptions);
  }
  redis = global.__redis;
}

export { redis };
