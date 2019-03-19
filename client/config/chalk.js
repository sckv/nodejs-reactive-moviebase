/* eslint-disable no-undef */
const chalk = require('chalk');

module.exports = green = message =>
  console.log(chalk.bold.underline.green(message));
