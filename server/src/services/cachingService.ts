import isEqual from 'fast-deep-equal';
import ioredis from 'ioredis';

import {hashUrl} from '../utils/hashUrl';
import {REDIS_CACHE_KEY_PREFIX} from './redisPollingService';
import {jsonSafeParse} from '@src/utils/jsonSafeParse';

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

    const {data, url} = jsonSafeParse<CacheDigestableMessage>(message);
    const prefixedUrl = REDIS_CACHE_KEY_PREFIX + hashUrl(url);
    const oldEntry = await RedisConnection.hget(prefixedUrl, 'data');
    if (oldEntry && isEqual(jsonSafeParse(oldEntry), data)) {
      //TODO: CHANGE FOR PINO
      console.log('cache:digest contents are the same', data, oldEntry);
      return;
    }

    //@ts-ignore
    await RedisConnection.hset(prefixedUrl, 'url', url, 'data', JSON.stringify(data));
    // DO WE NEED IT HERE?
    // await RedisConnection.expire(prefixedUrl, 60);
  });
  RedisSubscription.subscribe('digest:cache');
};

interface CacheDigestableMessage {
  data: {[k: string]: any};
  url: string;
}
