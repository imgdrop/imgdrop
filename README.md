# Image Drop - Online Image Converter

[![CI](https://github.com/imgdrop/imgdrop/workflows/CI/badge.svg?branch=master)](https://github.com/imgdrop/imgdrop/actions)
[![codecov](https://codecov.io/gh/imgdrop/imgdrop/branch/master/graph/badge.svg)](https://codecov.io/gh/imgdrop/imgdrop)

This is just a little (that ended up being alot bigger) open source project I started because I was tired with bad online image converters:

-  slow
-  puts you in a queue
-  lots of ads everywhere

This image converter works completely client side using modern technologies like WebWorkers and WebAssembly. It is a no-frills decoder in which you don't have to specify the format, you just have to drop an image (roll credits) and it always converts it to PNG.

## Supported Image Formats

-  browser supported formats:
   -  PNG
   -  JPEG
   -  BMP
   -  ICO
   -  WebP
-  `libwebp`
   -  WebP decoding for Safari (heck you Apple)
-  UTIF.js
   -  TIFF
-  OpenJPEG
   -  JPEG 2000
   -  JPEG 2000 Codestream
-  `libheif`
   -  HEIC (hopefully I don't get _too_ many users and land in patent infringement <\_<)
-  `@imgdrop/pnm`
   -  Pixel BitMap
   -  Pixel GrayMap
   -  Pixel PixMap
   -  Pixel Arbitrary Map
-  LibRaw
   -  Canon Raw
   -  Adobe Negative
   -  etc.

## Planned to Support

-  TIFF YUV
-  DDS family:
   -  DXT1
   -  DXT2
   -  DXT3
   -  DXT4
   -  DXT5
-  JPEG XR
-  AVIF

## Supported Browsers

-  Chrome 57+
   -  Chrome for Android 57+
   -  Opera 44+
-  Firefox 52+
   -  Firefox for Android 52+
-  Edge 16+
-  Safari 11+
   -  Safari for iOS 11+

# Development

## Building & Development

You will need a unix-like environment (`make`, `autogen`, `sh`, `cd`, `rm`, etc.) and the [Emscripten SDK](https://github.com/emscripten-core/emsdk).

After you have everything just run these commands and hope luck is on your side:

```sh
git submodule update --init
make -C wasm/webp
make -C wasm/jp2
make -C wasm/heif
make -C wasm/raw
```

The rest of the stack uses the usual Yarn dev environment:

```sh
yarn # install packages
yarn develop # start localhost
yarn build # build production
yarn serve # serve production
yarn lint # lint files
yarn fix # fix linting issues
yarn test # run unit tests
```

## File Structure Overview

-  `wasm`: all C code and submodules to be compiled to WebAssembly
   -  `webp`: WebP using `libwebp`
   -  `jp2`: JPEG 2000 using OpenJPEG
   -  `heif`: HEIC using `libheif` and `libde265`
   -  `raw`: Raw camera formats using LibRaw
-  `src`: Website code
   -  `pages`: Gatsby Pages (theres only one)
   -  `ui`: UI components
   -  `logging`: analytics, currently only Sentry logging
      -  split into its own folder so it can be loaded later as a chunk
   -  `color`: WebGL-based library for color conversions
      -  the key file to look at here is `shader-cache` which everything else heavily uses
   -  `decode`: The image format decoder
      -  `worker`: A worker to run blocking decode tasks on a different thread
         -  Each decoder is either in a WASM file or split out as a chunk to reduce initial load time
      -  Will first try browser decoder since its fast (`html`)
      -  Will then check header to detect filetype (`check*Image` methods)
      -  Will finally try raw decoder since it supports alot of formats (`raw`)
      -  TIFF is checked after raw since alot of raw files use a TIFF container (`tiff`)
   -  `util`: Utilities (dumping grounds)
