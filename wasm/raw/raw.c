#include "../util.h"
#include "output.h"
#include "libraw/libraw/libraw.h"

static libraw_data_t* rawImage;

static int rawProgress(void* user, enum LibRaw_progress progress, int iteration, int expected) {
   EM_ASM({
      console.debug(UTF8ToString($0)+' '+($1 + 1)+'/'+$2);
   }, libraw_strprogress(progress), iteration, expected);
   return 0;
}

static void rawError(int error) {
   EM_ASM({
      console.error('LibRaw error: ' + UTF8ToString($0));
   }, libraw_strerror(error));
   abort();
}

EMSCRIPTEN_KEEPALIVE void decodeRawImage(void) {
   int error;
   rawImage = libraw_init(0);
   libraw_set_progress_handler(rawImage, rawProgress, NULL);
   rawImage->params.half_size = true;
   rawImage->params.user_qual = 0;

   libraw_open_file_ex(rawImage, INPUT_PATH, 0);
   if ((error = libraw_unpack(rawImage)) != LIBRAW_SUCCESS) {
      rawError(error);
   }
   if ((error = libraw_dcraw_process(rawImage)) != LIBRAW_SUCCESS) {
      rawError(error);
   }

   outputCreate(rawImage->sizes.width, rawImage->sizes.height);
   if ((error = libraw_dcraw_ppm_tiff_writer(rawImage, "/output")) != LIBRAW_SUCCESS) {
      rawError(error);
   }
}

EMSCRIPTEN_KEEPALIVE uint16_t getRawWidth(void) {
   return rawImage->sizes.width;
}

EMSCRIPTEN_KEEPALIVE uint16_t getRawHeight(void) {
   return rawImage->sizes.height;
}
