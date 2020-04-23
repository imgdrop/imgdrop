const path = require('path');
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlPlugin = require('html-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const WorkerPlugin = require('worker-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = env => ({
   mode: env,
   entry: './src',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[contenthash].js',
      chunkFilename: '[name]-[contenthash].js',
      globalObject: 'self'
   },
   resolve: {
      extensions: ['.js', '.ts']
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            use: 'ts-loader'
         },
         {
            test: /\.css$/,
            use: [CssExtractPlugin.loader, 'css-loader']
         },
         {
            test: /\.(woff2?|wasm)$/,
            loader: 'file-loader',
            options: {
               name: '[ext]/[name]-[contenthash].[ext]'
            },
            type: 'javascript/auto'
         }
      ]
   },
   plugins: [
      new CleanPlugin(),
      new HtmlPlugin({
         template: './index.html'
      }),
      new CssExtractPlugin({
         filename: '[contenthash].css'
      }),
      new WorkerPlugin()
   ],
   optimization: {
      minimizer: [
         new TerserPlugin(),
         new OptimizeCssPlugin()
      ]
   },
   devtool: 'source-map'
});
