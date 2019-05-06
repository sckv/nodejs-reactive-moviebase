import IOredis from 'ioredis';
const {REDIS_PORT, REDIS_HOST, REDIS_DB} = process.env;

const instance = new IOredis({
  port: +REDIS_PORT || 6379,
  host: REDIS_HOST || 'localhost',
  db: +REDIS_DB || 0,
});

instance.on('ready', () => {
  instance.config('SET', 'notify-keyspace-events', 'K');
});

export const Cache = instance;
