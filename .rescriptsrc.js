const path = require('path');
const { name } = require('./package');

process.env.PORT = 8082;
// process.env.FAST_REFRESH = 'false';

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';
    config.resolve.alias = {
      ...config.resolve.alias,
      ['@']: path.resolve(__dirname, 'src'),
      ['@components']: path.resolve(__dirname, 'src/components'),
      ['@utils']: path.resolve(__dirname, 'src/utils'),
      ['@routes']: path.resolve(__dirname, 'src/routes'),
      ['@consts']: path.resolve(__dirname, 'src/consts'),
      ['@layouts']: path.resolve(__dirname, 'src/layouts'),
      ['@assets']: path.resolve(__dirname, 'src/assets'),
      ['@styles']: path.resolve(__dirname, 'src/styles'),
      ['@hooks']: path.resolve(__dirname, 'src/hooks'),
    };

    return config;
  },

  devServer: (config) => {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    config.historyApiFallback = true;
    // config.hot = false;
    // config.watchContentBase = false;
    // config.liveReload = false;

    return config;
  },
};
