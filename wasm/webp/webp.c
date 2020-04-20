#include <emscripten.h>
#include <stdlib.h>
#include "src/src/webp/decode.h"

static int webpWidth;
static int webpHeight;

EMSCRIPTEN_KEEPALIVE void* imageDecode(void* data, double dataSize) {
   uint8_t* image = WebPDecodeRGBA(data, dataSize, &webpWidth, &webpHeight);
   if (image == NULL) {
      abort();
   }
   return image;
}

EMSCRIPTEN_KEEPALIVE double imageWidth(void) {
   return webpWidth;
}

EMSCRIPTEN_KEEPALIVE double imageHeight(void) {
   return webpHeight;
}
