const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { name, version } = require('./package.json');
const fs = require('fs');
const { getPaths } = require('@rescripts/utilities');

process.env.PORT = 8084;
// process.env.FAST_REFRESH = 'false';

module.exports = {
  webpack: (config) => {
    // 给babel-loader添加common的编译
    // 参考 https://github.com/harrysolovay/rescripts#advanced-usage getPaths(predicate, scanTarget)
    const [babelPath] = getPaths(
      (inQuestion) =>
        inQuestion && inQuestion.loader && inQuestion.include && inQuestion.loader.includes('babel-loader'),
      config,
    );

    if (babelPath) {
      const babel = babelPath.reduce((curr, key) => curr[key], config);

      babel.include = [].concat(babel.include).concat(path.resolve(__dirname, '../../packages/common'));
    }

    // 去除导入src之外的模块限制, 由于我们很多公用代码放在了common里, 所以需要这么做
    config.resolve.plugins = config.resolve.plugins.filter((plg) => plg.constructor.name !== 'ModuleScopePlugin');

    // 配置输出产物, 使主应用也可做为子应用被加载
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    // 路径别名, 和 ./paths.json对应
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
      ['@schema']: path.resolve(__dirname, 'src/schema'),
      ['@common']: path.resolve(__dirname, '../../packages/common'),
    };

    if (config.mode !== 'development') {
      config.plugins = config.plugins.concat(
        new FileManagerPlugin({
          events: {
            onEnd: {
              mkdir: [`zip/${name}/dist`, `zip/${name}/template`],
              copy: [
                {
                  source: path.resolve(
                    __dirname,
                    `conf${
                      process.env.REACT_APP_TARGET_ENV === 'staging'
                        ? '.staging.js'
                        : process.env.REACT_APP_TARGET_ENV === 'cluster'
                        ? '.cluster.js'
                        : '.production.js'
                    }`,
                  ),
                  destination: `${path.resolve('build')}/config.js`,
                },
                {
                  source: `${path.resolve('build')}`,
                  destination: `zip/${name}/dist`,
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
                  destination: path.relative(__dirname, `../../${name}-${version}-SNAPSHOT.tar.gz`),
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
          runTasksInSeries: true,
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

    // 乾坤框架原因启动子应用无法更新，官方提供的方案是如下配置禁用热更新，这对开发主应用很不友好，
    // 所以暂时保留主框架热更新，子项目调试时手动刷新
    // config.historyApiFallback = true;
    // config.hot = false;
    // config.watchContentBase = false;
    // config.liveReload = false;

    return config;
  },
};
