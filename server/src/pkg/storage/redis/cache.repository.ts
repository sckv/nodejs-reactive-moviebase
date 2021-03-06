import { Redis } from 'ioredis';
import { SessionObject } from 'types/auth.repository';
import { CacheDigestableMessage } from 'types/cache';
import { jsonSafeParse } from '@src/utils';
import { Omit } from 'utility-types';
import { createObjectId } from '@src/utils/create-objectid';
import { CacheSettingSessionError } from '@src/errors/cache-errors/set-session';
import { CacheClearingSessionError } from '@src/errors/cache-errors/clear-session';
import { CacheClearingFromError } from '@src/errors/cache-errors/clear-from-cache';
import { CacheSettingToError } from '@src/errors/cache-errors/set-to-cache';
import { CacheGettingSessionError } from '@src/errors/cache-errors/get-session';
import { CacheAnnounceSubscriptionError } from '@src/errors/cache-errors/announce-subscription';
import { CacheExistSubscriptionError } from '@src/errors/cache-errors/exists-subscription';
import { CacheGettingFromError } from '@src/errors/cache-errors/get-from-cache';
import { logger } from '@src/utils/logger';

const SESSION_PREFIX = 'session:';
const CACHE_PREFIX = 'cache:';
const MONGO_SUBSCRIPTION_PREFIX = 'subscription:';

export const CacheRepository = (cache: Redis) => {
  return {
    setSession: async (sessionObject: SessionObject): Promise<boolean> => {
      const { language, sessionToken, userId } = sessionObject;
      try {
        const setted = await cache.hmset(SESSION_PREFIX + sessionToken, 'userId', String(userId), 'language', language);

        return setted ? true : false;
      } catch (error) {
        throw new CacheSettingSessionError({ data: sessionObject, log: error });
      }
    },
    getSession: async (token: string): Promise<Omit<SessionObject, 'sessionToken'> | null> => {
      try {
        const data = await cache.hmget(SESSION_PREFIX + token, 'userId', 'language');

        return data && data.length ? { userId: createObjectId(data[0]), language: data[1] } : null;
      } catch (e) {
        throw new CacheGettingSessionError({ data: { token }, log: e });
      }
    },
    clearSession: async (token: string): Promise<boolean> => {
      try {
        const deleted = await cache.hdel(SESSION_PREFIX + token, 'userId', 'language');

        return deleted ? true : false;
      } catch (error) {
        logger.error('clearing session error> ', error);
        throw new CacheClearingSessionError({ data: { token }, log: error });
      }
    },
    getFromCache: async <T>(urlHash: string): Promise<CacheDigestableMessage<T>> => {
      try {
        const chunk = await cache.get(CACHE_PREFIX + urlHash);

        return chunk ? { data: jsonSafeParse<T>(chunk) } : null;
      } catch (error) {
        throw new CacheGettingFromError({ data: { urlHash }, log: error });
      }
    },
    setToCache: async (setToObject: {
      urlHash: string;
      data: CacheDigestableMessage;
      timeout?: number;
    }): Promise<boolean> => {
      try {
        const { urlHash, data, timeout } = setToObject;

        let setted;
        if (typeof timeout === 'number')
          setted = cache.set(CACHE_PREFIX + urlHash, JSON.stringify(data.data), 'EX', timeout);
        else setted = cache.set(CACHE_PREFIX + urlHash, JSON.stringify(data.data));

        return setted ? true : false;
      } catch (error) {
        console.log(error);
        throw new CacheSettingToError({ data: { setToObject }, log: error });
      }
    },
    publishToCacheChannel: async <T>(msg: CacheDigestableMessage<T>) => {
      try {
        const result = cache.publish('digest:cache', JSON.stringify(msg));
        return !!result;
      } catch (error) {
        console.log('error publishing to cache channel', error);
      }
    },
    clearFromCache: async (urlHash: string): Promise<boolean> => {
      try {
        const cleared = await cache.del(CACHE_PREFIX + urlHash);

        return cleared ? true : false;
      } catch (error) {
        throw new CacheClearingFromError({ data: { urlHash }, log: error });
      }
    },
    announceSubscription: async (urlHash: string): Promise<boolean> => {
      try {
        const setted = await cache.set(MONGO_SUBSCRIPTION_PREFIX + urlHash, 1);

        return setted ? true : false;
      } catch (error) {
        throw new CacheAnnounceSubscriptionError({ data: { urlHash }, log: error });
      }
    },
    existsSubscription: async (urlHash: string): Promise<boolean> => {
      try {
        const value = await cache.get(MONGO_SUBSCRIPTION_PREFIX + urlHash);

        return value ? !!+value : !!value;
      } catch (error) {
        throw new CacheExistSubscriptionError({ data: { urlHash }, log: error });
      }
    },
    clearSubscription: async (urlHash: string): Promise<boolean> => {
      try {
        const deleted = await cache.del(MONGO_SUBSCRIPTION_PREFIX + urlHash);

        return deleted ? true : false;
      } catch (error) {
        throw new CacheExistSubscriptionError({ data: { urlHash }, log: error });
      }
    },
  };
};
