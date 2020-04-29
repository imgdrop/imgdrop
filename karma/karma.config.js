const path = require('path');
const { onCreateWebpackConfig } = require('../gatsby-node');

module.exports = (config) => {
   let webpackConfig = {
      mode: 'development',
      output: {},
      resolve: {
         extensions: ['.js', '.ts', '.tsx'],
      },
      module: {
         rules: [
            {
               test: /\.ts$/,
               loader: 'ts-loader',
               options: {
                  configFile: path.resolve(__dirname, 'tsconfig.json'),
               },
            },
         ],
      },
      plugins: [],
      devtool: 'inline-sourcemap',
   };
   onCreateWebpackConfig({
      stage: 'karma',
      getConfig() {
         return webpackConfig;
      },
      actions: {
         replaceWebpackConfig(config) {
            webpackConfig = config;
         },
      },
   });

   config.set({
      frameworks: ['jasmine'],
      files: ['*.karma.js'],
      preprocessors: {
         '*.karma.js': ['webpack', 'sourcemap'],
      },
      webpack: webpackConfig,
      customLaunchers: {
         ChromeWebdriver: {
            base: 'Selenium',
            browserName: 'chrome',
            config: {}
         },
         FirefoxWebdriver: {
            base: 'Selenium',
            browserName: 'firefox',
            config: {}
         },
         SafariWebdriver: {
            base: 'Selenium',
            browserName: 'safari',
            config: {}
         }
      }
   });
};
