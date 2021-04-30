const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { name, version } = require('./package.json');
const fs = require('fs');

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

    // config.module.rules = config.module.rules.concat({
    //   test: /\.less$/,
    //   use: [
    //     {
    //       loader: 'style-loader',
    //     },
    //     {
    //       loader: 'css-loader', // translates CSS into CommonJS
    //     },
    //     {
    //       loader: 'less-loader', // compiles Less to CSS
    //       options: {
    //         lessOptions: {
    //           modifyVars: {
    //             '@primary-color': 'red',
    //             'link-color': 'red',
    //             'border-radius-base': '3px',
    //           },
    //           javascriptEnabled: true,
    //         },
    //       },
    //     },
    //   ],
    // });

    // config.module.rules = config.module.rules.map((rule) => {
    //   if (Array.isArray(rule.oneOf)) {
    //     rule.oneOf.push({
    //       test: /\.less$/,
    //       use: [
    //         {
    //           loader: 'style-loader',
    //         },
    //         {
    //           loader: 'css-loader', // translates CSS into CommonJS
    //         },
    //         {
    //           loader: 'less-loader', // compiles Less to CSS
    //           options: {
    //             lessOptions: {
    //               modifyVars: {
    //                 'primary-color': 'red',
    //                 'link-color': 'red',
    //                 'border-radius-base': '3px',
    //               },
    //               javascriptEnabled: true,
    //             },
    //           },
    //         },
    //       ],
    //     });
    //   }

    //   return rule;
    // });

    if (config.mode !== 'development') {
      config.plugins = config.plugins.concat(
        new FileManagerPlugin({
          events: {
            onEnd: {
              mkdir: [`zip/${name}/dist`, `zip/${name}/template`],
              copy: [
                {
                  source: path.resolve('build'),
                  destination: `zip/${name}/dist`,
                },
                {
                  source: path.resolve(
                    __dirname,
                    `conf${process.env.REACT_APP_TARGET_ENV === 'staging' ? '.staging.js' : '.production.js'}`,
                  ),
                  destination: `zip/${name}/dist/config.js`,
                },
                {
                  source: path.resolve('template'),
                  destination: `zip/${name}/template`,
                },
                {
                  source: path.resolve(__dirname, `conf.template.js`),
                  destination: `zip/${name}/template/config.js`,
                },
              ],
              archive: [
                {
                  source: `zip`,
                  destination: `${name}-${version}-SNAPSHOT.tar.gz`,
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
    } else {
      let needCopy = false;
      const sourcePath = path.resolve(__dirname, 'conf.js');
      const destinationPath = path.resolve('public', 'config.js');

      try {
        const envSource = fs.readFileSync(sourcePath, { encoding: 'utf-8' });
        const envDestination = fs.readFileSync(destinationPath, { encoding: 'utf-8' });

        if (envSource === envDestination) {
          needCopy = false;
        } else {
          needCopy = true;
        }
      } catch (_) {
        needCopy = true;
      }

      if (needCopy) {
        config.plugins = config.plugins.concat(
          new FileManagerPlugin({
            events: {
              onEnd: {
                copy: [
                  {
                    source: sourcePath,
                    destination: destinationPath,
                  },
                ],
              },
            },
          }),
        );
      }
    }

    return config;
  },

  devServer: (config) => {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };

    // config.historyApiFallback = true;
    // config.hot = false;
    // config.watchContentBase = false;
    // config.liveReload = false;

    return config;
  },
};
