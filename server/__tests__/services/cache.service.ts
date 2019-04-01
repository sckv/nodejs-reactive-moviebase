import ioredis from 'ioredis';
import {hashUrl} from '../../src/utils/hashUrl';

const {REDIS_PORT, REDIS_HOST, REDIS_DB} = process.env;

export const REDIS_CACHE_KEY_PREFIX = 'cache:';

const redis = ioredis({
  port: +REDIS_PORT,
  host: REDIS_HOST,
  db: +REDIS_DB,
});

describe('<-- Cache service -->', () => {
  afterAll(() => {
    redis.disconnect();
  });

  it('receive and decode payload', async () => {
    const fixture = {url: '/test', data: {test: 'object', nice: ['array']}};

    await redis.publish('cache:digest', JSON.stringify(fixture));

    const hashedUrl = REDIS_CACHE_KEY_PREFIX + hashUrl(fixture.url);

    setTimeout(async () => {
      const {data, url} = JSON.parse(await redis.hmget(hashedUrl));
      expect(data).toEqual(fixture.data);
      expect(url).toEqual(fixture.url);
    }, 1000);
  });
});
