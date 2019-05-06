import {Redis} from 'ioredis';
import {SessionObject} from 'types/auth.repository';
import {CacheDigestableMessage} from 'types/cache';
import {jsonSafeParse} from '@src/utils';
import {Omit} from 'utility-types';
import {createObjectId} from '@src/utils/create-objectid';

const SESSION_PREFIX = 'session:';
const CACHE_PREFIX = 'cache:';
const MONGO_SUBSCRIPTION_PREFIX = 'subscription:';

export const CacheRepository = (cache: Redis) => {
  return {
    setSession: async ({language, sessionToken, userId}: SessionObject): Promise<boolean> => {
      const setted = await cache.hmset(SESSION_PREFIX + sessionToken, 'userId', String(userId), 'language', language);

      if (setted) return true;
      throw new Error('error setting session in cache');
    },
    getSession: async (token: string): Promise<Omit<SessionObject, 'sessionToken'>> => {
      const data = await cache.hmget(SESSION_PREFIX + token, 'userId', 'language');

      if (data && data.length) {
        return {userId: createObjectId(data[0]), language: data[1]};
      }
      throw new Error('error getting session from cache');
    },
    clearSession: async (token: string): Promise<boolean> => {
      const deleted = await cache.hdel(SESSION_PREFIX + token);

      if (deleted) return true;
      throw new Error('error clearing session from cache');
    },
    getFromCache: async ({key}: {key: string}): Promise<CacheDigestableMessage> => {
      try {
        const chunk = await cache.get(CACHE_PREFIX + key);
        if (chunk) {
          return {data: jsonSafeParse(chunk)};
        } else if (chunk === null) return null;
      } catch (error) {
        throw new Error('error getting information from cache');
      }
    },
    setToCache: async ({
      key,
      data,
      timeout,
    }: {
      key: string;
      data: CacheDigestableMessage;
      timeout?: number;
    }): Promise<boolean> => {
      let args: any[] = [CACHE_PREFIX + key, JSON.stringify(data.data)];
      if (typeof timeout === 'number') args = args.concat('EX', timeout);
      const setted = await cache.set.apply(args);

      if (setted) return true;
      // TODO: add custom errors for redis repo
      throw new Error('error inserting in cache');
    },
    clearFromCache: async (key: string): Promise<boolean> => {
      const cleared = await cache.del(CACHE_PREFIX + key);

      if (cleared) return true;
      throw new Error('error inserting in cache');
    },
    announceSubsription: async (urlHash: string): Promise<boolean> => {
      const setted = await cache.set(MONGO_SUBSCRIPTION_PREFIX + urlHash, 1);

      if (setted) return true;
      throw new Error('error announcing subscription to mongo');
    },
    existsSubscription: async (urlHash: string): Promise<boolean> => {
      const value = await cache.get(MONGO_SUBSCRIPTION_PREFIX + urlHash);

      return value ? !!+value : !!value;
    },
    clearSubscription: async (urlHash: string): Promise<boolean> => {
      const deleted = await cache.del(MONGO_SUBSCRIPTION_PREFIX + urlHash);

      if (deleted) return true;
      throw new Error('error clearing subscription from cache');
    },
  };
};
