const common = require('./babel.common');

module.exports = api => {
  api.cache(true);
  return common('server')(api);
};
