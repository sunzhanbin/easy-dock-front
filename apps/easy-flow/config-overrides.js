const {
  override,
  addWebpackAlias,
  removeModuleScopePlugin,
  babelInclude,
  overrideDevServer,
  /*  addWebpackPlugin, */
} = require('customize-cra');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path');
const appPackageJson = require('./package.json');
const paths = require('./paths');
process.env.PORT = 8083;

module.exports = {
  webpack: override(
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
    function overrideWebpackOutput(config) {
      config.output = {
        ...config.output,
        globalObject: 'window',
        libraryTarget: 'umd',
        library: `${appPackageJson.name}-[name]`,
      };

      return config;
    },

    function overrideWebpackPlugin(config) {
      config.plugins.push(
        new FileManagerPlugin({
          events: {
            onEnd: {
              copy: [
                {
                  source: `${paths.appPath}/conf.js`,
                  destination: `${paths.appPublic}/config.js`,
                },
              ],
            },
          },
        }),
      );

      process.env.REACT_APP_TARGET_ENV !== 'development' &&
        config.plugins.push(
          new FileManagerPlugin({
            events: {
              onEnd: {
                mkdir: [`zip/${appPackageJson.name}/dist`, `zip/${appPackageJson.name}/template`],
                copy: [
                  {
                    source: paths.appBuild,
                    destination: `zip/${appPackageJson.name}/dist`,
                  },
                  {
                    source: `${paths.appPath}/conf${
                      process.env.REACT_APP_TARGET_ENV === 'staging' ? '.staging.js' : '.production.js'
                    }`,
                    destination: `zip/${appPackageJson.name}/dist/config.js`,
                  },
                  {
                    source: paths.appTemplate,
                    destination: `zip/${appPackageJson.name}/template`,
                  },
                  {
                    source: `${paths.appPath}/conf.template.js`,
                    destination: `zip/${appPackageJson.name}/template/config.js`,
                  },
                ],
                archive: [
                  {
                    source: `zip`,
                    destination: `../../${appPackageJson.name}-${appPackageJson.version}-SNAPSHOT.tar.gz`,
                    format: 'tar',
                    options: {
                      gzip: true,
                      gzipOptions: {
                        level: 1,
                      },
                      globOptions: {
                        nomount: true,
                      },
                    },
                  },
                ],
                delete: ['zip'],
              },
            },
          }),
        );
      return config;
    },
  ),
  devServer: overrideDevServer((config) =>
    Object.assign({}, config, {
      headers: {
        ...config.headers,
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ),
};
