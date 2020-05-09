#include "../util.h"
#include "libheif/libheif/heif.h"

static struct heif_image* heifImage;

static void heifError(struct heif_error error) {
   EM_ASM({
      console.error('libheif error: ' + UTF8ToString($0));
   }, error.message);
   abort();
}

EMSCRIPTEN_KEEPALIVE void decodeHeifImage(void) {
   struct heif_error error;
   struct heif_context* ctx = heif_context_alloc();
   if ((error = heif_context_read_from_file(ctx, INPUT_PATH, NULL)).code != heif_error_Ok) {
      heifError(error);
   }

   struct heif_image_handle* handle;
   heif_context_get_primary_image_handle(ctx, &handle);
   if ((error = heif_decode_image(handle, &heifImage, heif_colorspace_undefined, heif_chroma_undefined, NULL)).code != heif_error_Ok) {
      heifError(error);
   }
}

EMSCRIPTEN_KEEPALIVE enum heif_colorspace getHeifColorspace(void) {
   return heif_image_get_colorspace(heifImage);
}

EMSCRIPTEN_KEEPALIVE enum heif_chroma getHeifChroma(void) {
   return heif_image_get_chroma_format(heifImage);
}

EMSCRIPTEN_KEEPALIVE const uint8_t* getHeifData(enum heif_channel plane) {
   return heif_image_get_plane_readonly(heifImage, plane, NULL);
}

EMSCRIPTEN_KEEPALIVE int getHeifStride(enum heif_channel plane) {
   int stride;
   heif_image_get_plane_readonly(heifImage, plane, &stride);
   return stride;
}

EMSCRIPTEN_KEEPALIVE int getHeifWidth(enum heif_channel plane) {
   return heif_image_get_width(heifImage, plane);
}

EMSCRIPTEN_KEEPALIVE int getHeifHeight(enum heif_channel plane) {
   return heif_image_get_height(heifImage, plane);
}
