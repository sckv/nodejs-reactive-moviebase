import {Redis} from 'ioredis';
import {SessionObject} from 'types/auth.repository';

export const AuthCacheRepository = (redis: Redis) => {
  return {
    setSession: async (data: SessionObject): Promise<boolean> => {},
    clearSession: async (token: string): Promise<boolean> => {},
  };
};
