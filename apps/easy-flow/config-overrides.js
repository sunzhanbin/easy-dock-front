const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@utils': path.resolve(__dirname, './src/utils'),
    '@': path.resolve(__dirname, './src'),
    '@layouts': path.resolve(__dirname, './src/layouts'),
    '@components': path.resolve(__dirname, './src/components'),
    '@styles': path.resolve(__dirname, './src/styles'),
    '@consts': path.resolve(__dirname, './src/consts'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@type': path.resolve(__dirname, './src/type'),
    '@app': path.resolve(__dirname, './src/app'),
    '@config': path.resolve(__dirname, './src/config'),
  }),
);
