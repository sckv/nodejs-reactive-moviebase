import ioredis from 'ioredis';
import isEqual from 'fast-deep-equal';
import {hashUrl} from '../utils/hashUrl';
import {REDIS_CACHE_KEY_PREFIX} from './redisPollingService';

const {REDIS_PORT, REDIS_HOST, REDIS_DB} = process.env;

const RedisConnection = new ioredis({
  port: +REDIS_PORT || 6379,
  host: REDIS_HOST || 'localhost',
  db: +REDIS_DB || 0,
});

const RedisSubscription = RedisConnection.duplicate();

RedisConnection.on('ready', () => {
  RedisConnection.config('SET', 'notify-keyspace-events', 'K');
});

export const cachingService = () => {
  RedisSubscription.on('message', async (channel, message) => {
    if (channel !== 'digest:cache') return;
    try {
      const {data, url} = JSON.parse(message);
      const prefixedUrl = REDIS_CACHE_KEY_PREFIX + hashUrl(url);
      const oldEntry = await RedisConnection.hmget(prefixedUrl, 'data');

      if ((oldEntry.length && !oldEntry[0]) || !isEqual(JSON.parse(oldEntry), data)) {
        try {
          //@ts-ignore
          await RedisConnection.hset(prefixedUrl, 'url', url, 'data', JSON.stringify(data));
          // DO WE NEED IT HERE?
          // await RedisConnection.expire(prefixedUrl, 60);
        } catch (e) {
          console.log('Error at cache refill', e);
        }
      }
    } catch (e) {
      console.log('Error parsing message', e);
    }
  });

  RedisSubscription.subscribe('digest:cache', () => {
    console.log('SUBSCRIBED TO digest:cache');
  });
};

// cachingService();
