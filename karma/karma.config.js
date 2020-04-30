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
      files: ['tests/*.js'],
      preprocessors: {
         'tests/*.js': ['webpack', 'sourcemap'],
      },
      webpack: webpackConfig,
   });
};
