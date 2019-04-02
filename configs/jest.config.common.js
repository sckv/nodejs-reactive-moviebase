const path = require('path');
const abs = fileName => path.resolve(fileName);

module.exports = dir => ({
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': abs('configs/preprocessor.js'),
  },
  rootDir: abs(`.`),
  // testRegex: '(client/src/.*(\\.| /)(test|spec))\\.(tsx?)$',
  //(${dir}/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$
  testMatch: [__dirname + `/${dir}/__tests__/**/*.test.(ts|tsx)`], // uncomment if you want keep tests in __tests__ folder
  setupFiles: ['dotenv/config'],
  resetMocks: true,
  moduleNameMapper: {
    '@src(.*)': `<rootDir>/${dir}/src/$1`,
  },
});
