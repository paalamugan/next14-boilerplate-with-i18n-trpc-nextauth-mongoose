import { Redis } from '@upstash/redis';

import { env } from '@/env';
import { logger } from '@/server/logger';

let cached = global.upstashRedis;

if (!cached) {
  global.upstashRedis = cached;
}

export const upstashRedis = (() => {
  try {
    if (cached) return cached;
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
    }
    const instance = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    cached = instance;
    return cached;
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return null;
  }
})();

if (process.env.NODE_ENV !== 'production') global.upstashRedis = upstashRedis;
