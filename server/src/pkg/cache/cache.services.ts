import {CacheRepository} from '@src/pkg/storage/redis/cache.repository';
import {Cache} from '@src/redis';
import {SessionObject} from 'types/auth.repository';
import {CacheDigestableMessage} from 'types/cache';

export const CacheServices = {
  setSession: (so: SessionObject) => CacheRepository(Cache).setSession(so),
  getSession: (token: string) => CacheRepository(Cache).getSession(token),
  clearSession: (token: string) => CacheRepository(Cache).clearSession(token),
  getFromCache: <T = any>(urlHash: string) => CacheRepository(Cache).getFromCache<T>(urlHash),
  setToCache: <T = any>(data: {urlHash: string; data: CacheDigestableMessage<T>; timeout?: number}) =>
    CacheRepository(Cache).setToCache(data),
  publishToDigest: (data: CacheDigestableMessage) => CacheRepository(Cache).publishToCacheChannel(data),
  clearFromCache: (urlHash: string) => CacheRepository(Cache).clearFromCache(urlHash),
  announceSubscription: (urlHash: string) => CacheRepository(Cache).announceSubscription(urlHash),
  existsSubscription: (urlHash: string) => CacheRepository(Cache).existsSubscription(urlHash),
  clearSubscription: (urlHash: string) => CacheRepository(Cache).clearSubscription(urlHash),
};
