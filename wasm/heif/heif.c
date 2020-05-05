#include "../util.h"
#include "libheif/libheif/heif.h"

static struct heif_image* heifImage;

static void heifError(struct heif_error error) {
   EM_ASM({
      console.error('libheif error: ' + UTF8ToString($0));
   }, error.message);
   abort();
}

EMSCRIPTEN_KEEPALIVE const uint8_t* decodeHeifImage(void) {
   struct heif_error error;
   struct heif_context* ctx = heif_context_alloc();
   if ((error = heif_context_read_from_file(ctx, INPUT_PATH, NULL)).code != heif_error_Ok) {
      heifError(error);
   }

   struct heif_image_handle* handle;
   heif_context_get_primary_image_handle(ctx, &handle);
   if ((error = heif_decode_image(handle, &heifImage, heif_colorspace_RGB, heif_chroma_interleaved_RGBA, NULL)).code != heif_error_Ok) {
      heifError(error);
   }
   return heif_image_get_plane_readonly(heifImage, heif_channel_interleaved, NULL);
}

EMSCRIPTEN_KEEPALIVE int getHeifWidth(void) {
   return heif_image_get_width(heifImage, heif_channel_interleaved);
}

EMSCRIPTEN_KEEPALIVE int getHeifHeight(void) {
   return heif_image_get_height(heifImage, heif_channel_interleaved);
}
