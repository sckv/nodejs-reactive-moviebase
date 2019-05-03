import ioredis from 'ioredis';
import {hashUrl, jsonSafeParse} from '../../src/utils';

import {cachingService} from '../../src/services/caching-service';

const {REDIS_PORT, REDIS_HOST, REDIS_DB} = process.env;

export const REDIS_CACHE_KEY_PREFIX = 'cache:';

const redis = new ioredis({
  port: +REDIS_PORT || 6379,
  host: REDIS_HOST || 'localhost',
  db: +REDIS_DB || 0,
});

jest.setTimeout(25000);

export default describe('<-- Cache service -->', () => {
  beforeAll(() => {
    cachingService();
  }, 5000);
  afterAll(() => {
    redis.disconnect();
  });

  it('receive and decode payload', async done => {
    const fixture = {url: '/test', data: {test: 'object', nice: ['array']}};

    await new Promise(resolve =>
      setTimeout(async () => {
        await redis.publish('digest:cache', JSON.stringify(fixture));
        resolve();
      }, 2000),
    );

    const hashedUrl = REDIS_CACHE_KEY_PREFIX + hashUrl(fixture.url);

    await new Promise(resolve =>
      setTimeout(async () => {
        const [data, url] = await redis.hmget(hashedUrl, 'data', 'url');
        if (!data || !url) fail();
        expect(jsonSafeParse(data)).toEqual(fixture.data);
        expect(url).toEqual(fixture.url);
        resolve();
        done();
      }, 3000),
    );
  }, 8000);
});