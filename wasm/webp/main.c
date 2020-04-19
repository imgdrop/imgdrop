#include <emscripten.h>
#include <stdlib.h>
#include "src/src/webp/decode.h"

static int decodeWidth;
static int decodeHeight;

EMSCRIPTEN_KEEPALIVE uint8_t* webpAllocate(size_t size) {
   return malloc(size);
}

EMSCRIPTEN_KEEPALIVE uint8_t* webpDecode(uint8_t* data, size_t dataSize) {
   uint8_t* result = WebPDecodeRGBA(data, dataSize, &decodeWidth, &decodeHeight);
   if (result == NULL) {
      abort();
   }
   return result;
}

EMSCRIPTEN_KEEPALIVE int webpWidth(void) {
   return decodeWidth;
}

EMSCRIPTEN_KEEPALIVE int webpHeight(void) {
   return decodeHeight;
}
