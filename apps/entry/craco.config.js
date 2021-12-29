const babelInclude = require("@dealmore/craco-plugin-babel-include");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const { whenProd } = require("@craco/craco");
const path = require("path");
const { name, version } = require("./package.json");

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
  // style: {
  //     modules: {
  //         localIdentName: ""
  //     },
  //     css: {
  //         loaderOptions: { /* Any css-loader configuration options: https://github.com/webpack-contrib/css-loader. */ },
  //         loaderOptions: (cssLoaderOptions, { env, paths }) => { return cssLoaderOptions; }
  //     },
  //     sass: {
  //         loaderOptions: { /* Any sass-loader configuration options: https://github.com/webpack-contrib/sass-loader. */ },
  //         loaderOptions: (sassLoaderOptions, { env, paths }) => { return sassLoaderOptions; }
  //     },
  //     postcss: {
  //         mode: "extends" /* (default value) */ || "file",
  //         plugins: [require('plugin-to-append')], // Additional plugins given in an array are appended to existing config.
  //         plugins: (plugins) => [require('plugin-to-prepend')].concat(plugins), // Or you may use the function variant.
  //         env: {
  //             autoprefixer: { /* Any autoprefixer options: https://github.com/postcss/autoprefixer#options */ },
  //             stage: 3, /* Any valid stages: https://cssdb.org/#staging-process. */
  //             features: { /* Any CSS features: https://preset-env.cssdb.org/features. */ }
  //         },
  //         loaderOptions: { /* Any postcss-loader configuration options: https://github.com/postcss/postcss-loader. */ },
  //         loaderOptions: (postcssLoaderOptions, { env, paths }) => { return postcssLoaderOptions; }
  //     }
  // },
  // eslint: {
  //     enable: true /* (default value) */,
  //     mode: "extends" /* (default value) */ || "file",
  //     configure: { /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */ },
  //     configure: (eslintConfig, { env, paths }) => { return eslintConfig; },
  //     pluginOptions: { /* Any eslint plugin configuration options: https://github.com/webpack-contrib/eslint-webpack-plugin#options. */ },
  //     pluginOptions: (eslintOptions, { env, paths }) => { return eslintOptions; }
  // },
  // babel: {
  //     include: [path.resolve(__dirname, '../../packages/common'), path.resolve(__dirname, 'src')],
  //     presets: [],
  //     plugins: [],
  //     loaderOptions: { /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */ },
  //     loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions; }
  // },
  // typescript: {
  //     enableTypeChecking: true /* (default value)  */
  // },
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
    // plugins: {
    //     add: [], /* An array of plugins */
    //     add: [
    //         plugin1,
    //         [plugin2, "append"],
    //         [plugin3, "prepend"], /* Specify if plugin should be appended or prepended */
    //     ], /* An array of plugins */
    //     remove: [],  /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */
    // },
    // configure: { /* Any webpack configuration options: https://webpack.js.org/configuration */ },
    configure: (webpackConfig, { env, paths }) => {
      // 配置扩展扩展名
      webpackConfig.resolve.extensions = [
        ...webpackConfig.resolve.extensions,
        ...[".scss", ".css"],
      ];
      whenProd(() => {
        webpackConfig.plugins = webpackConfig.plugins.concat(
          new FileManagerPlugin({
            events: {
              onEnd: {
                mkdir: [`zip/${name}/dist`, `zip/${name}/template`],
                copy: [
                  {
                    source: `${path.resolve("build")}`,
                    destination: `zip/${name}/dist`,
                  },
                  {
                    source: path.resolve("template"),
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

        webpackConfig.output.publicPath = '/entry/';
      });
      return webpackConfig;
    },
  },
  // devServer: {
  //   /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver. */
  // },
  // devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
  //   console.log("craco.config::devServerConfig", {
  //     devServerConfig,
  //     env,
  //     paths,
  //     proxy,
  //     allowedHost,
  //   });
  //   return {
  //     ...devServerConfig,
  //     "Access-Control-Allow-Origin": "*",
  //   };
  // },
  // plugins: [
  //   {
  //     plugin: {
  //       overrideCracoConfig: ({
  //         cracoConfig,
  //         pluginOptions,
  //         context: { env, paths },
  //       }) => {
  //         return cracoConfig;
  //       },
  //       overrideWebpackConfig: ({
  //         webpackConfig,
  //         cracoConfig,
  //         pluginOptions,
  //         context: { env, paths },
  //       }) => {
  //         return webpackConfig;
  //       },
  //       overrideDevServerConfig: ({
  //         devServerConfig,
  //         cracoConfig,
  //         pluginOptions,
  //         context: { env, paths, proxy, allowedHost },
  //       }) => {
  //         return devServerConfig;
  //       },
  //       overrideJestConfig: ({
  //         jestConfig,
  //         cracoConfig,
  //         pluginOptions,
  //         context: { env, paths, resolve, rootDir },
  //       }) => {
  //         return jestConfig;
  //       },
  //     },
  //     options: {},
  //   },
  // ],
};
