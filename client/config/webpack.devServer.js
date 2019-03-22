const webpack = require('webpack');
const path = require('path');
const webpackDevServer = require('webpack-dev-server');
const green = require('./chalk');
const port = process.env.REACT_PORT || 4200;

const webpackConfig = require('./webpack.dev');

const devServerConfig = {
  contentBase: path.join(__dirname, 'src'),
  historyApiFallback: true,
  hot: true,
  open: true,
  inline: true,
  progress: true,
  publicPath: '/',
  port,
  host: 'localhost',
  clientLogLevel: 'none',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  stats: {
    colors: true,
  },
};

webpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig);
const compiler = webpack(webpackConfig);
const server = new webpackDevServer(compiler, devServerConfig);
server.listen(port, '127.0.0.1', () => green(`Webpack dev server listening at: http://localhost:${port}`));
