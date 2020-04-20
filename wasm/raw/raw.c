#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include "src/libraw/libraw.h"

static libraw_data_t* rawImage;

static void checkError(int error) {
   if (error != LIBRAW_SUCCESS) {
      puts(libraw_strerror(error));
      abort();
   }
}

EMSCRIPTEN_KEEPALIVE void* imageDecode(void* data, double dataSize) {
   rawImage = libraw_init(0);
   checkError(libraw_open_buffer(rawImage, data, dataSize));
   checkError(libraw_unpack(rawImage));
   checkError(libraw_raw2image(rawImage));
   libraw_subtract_black(rawImage);

   size_t size = rawImage->sizes.iwidth * rawImage->sizes.iheight;
   uint8_t* image = malloc(size * 4);
   for (int i = 0; i < size; ++i) {
      image[i * 4 + 0] = rawImage->image[0][i];
      image[i * 4 + 1] = rawImage->image[1][i];
      image[i * 4 + 2] = rawImage->image[2][i];
      image[i * 4 + 3] = 255;
   }
   return image;
}

EMSCRIPTEN_KEEPALIVE double imageWidth(void) {
   return rawImage->sizes.iwidth;
}

EMSCRIPTEN_KEEPALIVE double imageHeight(void) {
   return rawImage->sizes.iheight;
}
