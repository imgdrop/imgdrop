const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
   actions.setWebpackConfig({
      resolve: {
         alias: {
            '~wasm': path.resolve(__dirname, 'wasm')
         }
      }
   });
};
