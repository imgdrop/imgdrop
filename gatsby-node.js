const WorkerPlugin = require('worker-plugin');

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
   const config = getConfig();
   config.output.globalObject = 'this';
   config.module.rules.push(
      {
         test: /\.glsl$/,
         use: 'webpack-glsl-minify',
      },
      {
         test: /\.wasm$/,
         use: 'file-loader',
         type: 'javascript/auto',
      }
   );

   if (!stage.endsWith('-html')) {
      config.plugins.push(new WorkerPlugin());
   }
   actions.replaceWebpackConfig(config);
};
