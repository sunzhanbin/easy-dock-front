const {
  override,
  addWebpackAlias,
  removeModuleScopePlugin,
  babelInclude,
} = require('customize-cra');
const path = require('path');

// module.exports = function (config, env) {
//   const webpackConfig = removeModuleScopePlugin()(config, env);

//   webpackConfig.resolve.alias = {
//     ...webpackConfig.resolve.alias,
//     '@utils': path.resolve(__dirname, './src/utils'),
//     '@': path.resolve(__dirname, './src'),
//     '@layouts': path.resolve(__dirname, './src/layouts'),
//     '@components': path.resolve(__dirname, './src/components'),
//     '@styles': path.resolve(__dirname, './src/styles'),
//     '@consts': path.resolve(__dirname, './src/consts'),
//     '@assets': path.resolve(__dirname, './src/assets'),
//     '@type': path.resolve(__dirname, './src/type'),
//     '@app': path.resolve(__dirname, './src/app'),
//     '@config': path.resolve(__dirname, './src/config'),
//     '@common': path.resolve(__dirname, '../../packages/common'),
//   };

//   return webpackConfig;
// };

module.exports = override(
  babelInclude([path.resolve(__dirname, '../../packages/common'), path.resolve(__dirname, 'src')]),
  removeModuleScopePlugin(),
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
    '@common': path.resolve(__dirname, '../../packages/common'),
  }),
);
