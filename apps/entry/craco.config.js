const babelInclude = require("@dealmore/craco-plugin-babel-include");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const fs = require('fs');
const path = require("path");
const { name, version } = require("./package.json");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const appPath = resolveApp('.');
const appBuild = resolveApp('build');

module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  plugins: [
    {
      plugin: babelInclude,
      options: {
        include: [
          path.resolve(__dirname, "../../packages/common"),
          path.resolve(__dirname, "src"),
        ],
      },
    },
    {
      plugin: {
        overrideDevServerConfig: ({ devServerConfig }) => {
          return {
            ...devServerConfig,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          };
        },
      },
    },
  ],
  webpack: {
    alias: {
      ["@"]: path.resolve(__dirname, "src"),
      ["@components"]: path.resolve(__dirname, "src/components"),
      ["@containers"]: path.resolve(__dirname, "src/containers"),
      ["@utils"]: path.resolve(__dirname, "src/utils"),
      ["@http"]: path.resolve(__dirname, "src/http"),
      ["@routes"]: path.resolve(__dirname, "src/routes"),
      ["@views"]: path.resolve(__dirname, "src/views"),
      ["@assets"]: path.resolve(__dirname, "src/assets"),
      ["@styles"]: path.resolve(__dirname, "src/styles"),
      ["@consts"]: path.resolve(__dirname, "src/consts"),
      ["@common"]: path.resolve(__dirname, "../../packages/common"),
    },
    // configure: { /* Any webpack configuration options: https://webpack.js.org/configuration */ },
    configure: (webpackConfig, { env, paths }) => {
      // 配置扩展扩展名
      webpackConfig.resolve.extensions = [
        ...webpackConfig.resolve.extensions,
        ...[".scss", ".css"],
      ];

      if (env !== "development") {
        webpackConfig.plugins = webpackConfig.plugins.concat(
          new FileManagerPlugin({
            events: {
              onEnd: {
                mkdir: [`zip/${name}/dist`, `zip/${name}/template`],
                copy: [
                  {
                    source: `${appPath}/conf${process.env.REACT_APP_TARGET_ENV === 'dev' ? '.development.js' : '.production.js'}`,
                    destination: `${appBuild}/config.js`,
                  },
                  {
                    source: `${path.resolve("build")}`,
                    destination: `zip/${name}/dist`,
                  },
                  {
                    source: path.resolve("template"),
                    destination: `zip/${name}/template`,
                  },
                ],
                archive: [
                  {
                    source: `zip`,
                    destination: path.relative(
                      __dirname,
                      `../../${name}-${version}-SNAPSHOT.tar.gz`
                    ),
                    format: "tar",
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
                delete: ["zip"],
              },
            },
            runTasksInSeries: true,
          })
        );
      }
      return webpackConfig;
    },
  },
};
