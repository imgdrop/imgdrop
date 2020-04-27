#include "../util.h"
#include "libwebp/src/webp/decode.h"

static int webpWidth;
static int webpHeight;

EMSCRIPTEN_KEEPALIVE uint8_t* decodeWebpImage(void) {
   size_t dataSize;
   void* data = readInput(&dataSize);
   uint8_t* rgba = WebPDecodeRGBA(data, dataSize, &webpWidth, &webpHeight);
   free(data);
   return rgba;
}

EMSCRIPTEN_KEEPALIVE int getWebpWidth(void) {
   return webpWidth;
}

EMSCRIPTEN_KEEPALIVE int getWebpHeight(void) {
   return webpHeight;
}
