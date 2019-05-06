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
  }, 3000);
  afterAll(() => {
    redis.disconnect();
  });

  it('receive and decode payload', async done => {
    const fixture = {url: '/test', data: {test: 'object', nice: ['array']}};

    await redis.publish('digest:cache', JSON.stringify(fixture));

    const hashedUrl = REDIS_CACHE_KEY_PREFIX + hashUrl(fixture.url);

    const data = await redis.get(hashedUrl);
    if (!data) fail();
    expect(jsonSafeParse(data)).toEqual(fixture.data);
    done();
  }, 8000);
});
