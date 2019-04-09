import {Redis} from 'ioredis';

export const AuthCacheRepository = (connection: Redis) => {
  return {
    setSession: async () => {},
  };
};
