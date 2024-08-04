import { Redis } from 'ioredis';

import { env } from '@/env';
import { logger } from '@/server/logger';

let cached = global.redis;

if (!cached) {
  global.redis = cached;
}

export const redis = (() => {
  if (cached) return cached;
  let options = {};
  if (process.env.NODE_ENV === 'production') {
    options = {
      tls: {
        rejectUnauthorized: false,
      },
    };
  }
  const instance = new Redis(env.REDIS_URL, options);

  // instance.on('connect', () => {
  //   logger.info('Redis database connected');
  // });

  instance.on('error', error => {
    logger.error(`There was an error with the redis client ${error}`);
  });

  cached = instance;
  return cached;
})();

if (process.env.NODE_ENV !== 'production') global.redis = redis;
