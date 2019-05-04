jest.setTimeout(25000);

describe('Testing services...', () => {
  require('./authorizing.tests');
  require('./user-controling.tests');
  require('./cache.tests');
});
