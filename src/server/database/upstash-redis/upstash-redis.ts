import { Redis } from '@upstash/redis';

import { env } from '@/env';

let cached = global.upstashRedis;

if (!cached) {
  global.upstashRedis = cached;
}

export const upstashRedis = (() => {
  if (cached) return cached;
  const instance = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  cached = instance;
  return cached;
})();

if (process.env.NODE_ENV !== 'production') global.upstashRedis = upstashRedis;
