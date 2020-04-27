const WorkerPlugin = require('worker-plugin');

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
   const config = getConfig();
   config.output.globalObject = 'this';
   config.module.rules.push({
      test: /\.wasm$/,
      use: 'file-loader',
   });

   if (!stage.endsWith('-html')) {
      config.plugins.push(new WorkerPlugin());
   }
   actions.replaceWebpackConfig(config);
};
