import ioredis from 'ioredis';
import isEqual from 'fast-deep-equal';
import {hashUrl} from '@src/utils/hashUrl';
import {REDIS_CACHE_KEY_PREFIX} from '@src/services/redisPollingService';

const {REDIS_PORT, REDIS_HOST, REDIS_DB} = process.env;

const RedisConnection = ioredis({
  port: +REDIS_PORT,
  host: REDIS_HOST,
  db: +REDIS_DB,
});

const RedisSubscription = RedisConnection.duplicate();

RedisConnection.on('ready', () => {
  RedisConnection.config('HMSET', 'notify-keyspace-events', 'Ex');
});

export const cachingService = () => {
  RedisSubscription.on('message', async (channel, message) => {
    if (channel !== 'digest:cache') return;
    const {data, url} = JSON.parse(message);
    const prefixedUrl = REDIS_CACHE_KEY_PREFIX + hashUrl(url);

    const oldEntry = await RedisConnection.hmget(prefixedUrl, 'data');

    if (!isEqual(JSON.parse(oldEntry), data)) {
      try {
        await RedisConnection.hmset(prefixedUrl, 'url', url, 'data', data);
        // DO WE NEED IT HERE?
        // await RedisConnection.expire(prefixedUrl, 60);
      } catch (e) {
        console.log('Error at cache refill');
      }
    }
  });

  RedisSubscription.subscribe('digest:cache');
};
