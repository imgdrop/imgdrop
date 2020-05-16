const path = require('path');
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

exports.createPages = ({ actions }) => {
   const createPage = (code, name) => {
      actions.createPage({
         path: code,
         component: path.resolve('./src/pages/index.tsx'),
         context: {
            imageName: name,
         },
      });
   };

   createPage('jpg', 'JPEG');
   createPage('bmp', 'Bitmap');
   createPage('ico', 'Microsoft Icon');
   createPage('webp', 'WebP');
   createPage('tiff', 'TIFF');
   createPage('jp2', 'JPEG 2000');
   createPage('j2k', 'JPEG 2000 codestream');
   createPage('heif', 'HEIF');
   createPage('heic', 'HEIC');
   createPage('heix', 'HEIX');
   createPage('netpbm', 'NetPBM');
   createPage('pnm', 'PNM');
   createPage('pbm', 'Pixel Bitmap');
   createPage('pgm', 'Pixel Graymap');
   createPage('ppm', 'Pixel Pixmap');
   createPage('pam', 'Pixel Arbitrary Map');
   createPage('dds', 'DirectDraw Surface');
   createPage('cr2', 'Canon raw');
   createPage('nef', 'Nikon raw');
   createPage('raf', 'Fuji raw');
   createPage('dng', 'Digital negative');
};
