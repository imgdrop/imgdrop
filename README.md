# Image Drop - Online Image Converter
This is just a little (that ended up being alot bigger) open source project I started because I was tired with bad online image converters:

- slow
- puts you in a queue
- lots of ads everywhere

This image converter works completely client side using modern technologies like WebWorkers and WebAssembly. It is a no-frills decoder in which you don't have to specify the format, you just have to drop an image (roll credits) and it always converts it to PNG.

Currently supported image formats:

- browser supported formats:
  - PNG
  - JPEG
  - BMP
  - ICO
  - WebP
- `libwebp`
  - WebP decoding for Safari (heck you Apple)
- UTIF.js
  - TIFF
- OpenJPEG
  - JPEG 2000
  - JPEG 2000 Codestream
- `libheif`
  - HEIC (hopefully I don't get *too* many users and land in patent infringement <_<)
- LibRaw
  - Canon Raw
  - Adobe Negative
  - etc.

Planned to support image formats:

- TIFF YUV
- NetPBM family:
  - Pixel BitMap
  - Pixel GrayMap
  - Pixel PixMap
  - Pixel Arbitrary Map
- DDS family:
  - DXT1
  - DXT2
  - DXT3
  - DXT4
  - DXT5
- JPEG XR
- AVIF
