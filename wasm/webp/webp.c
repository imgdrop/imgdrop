#include <emscripten.h>
#include <stdlib.h>
#include "src/src/webp/decode.h"

static int webpWidth;
static int webpHeight;

EMSCRIPTEN_KEEPALIVE uint8_t* imageDecode(uint8_t* data, size_t dataSize) {
   uint8_t* result = WebPDecodeRGBA(data, dataSize, &webpWidth, &webpHeight);
   if (result == NULL) {
      abort();
   }
   return result;
}

EMSCRIPTEN_KEEPALIVE int imageWidth(void) {
   return webpWidth;
}

EMSCRIPTEN_KEEPALIVE int imageHeight(void) {
   return webpHeight;
}
