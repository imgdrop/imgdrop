#include "../util.h"
#include "stream.h"
#include "openjpeg/src/lib/openjp2/openjpeg.h"

static opj_image_t* jp2Image;

static void messageHandler(const char* msg, void* user) {
   puts(msg);
}

EMSCRIPTEN_KEEPALIVE enum COLOR_SPACE decodeJP2Image(void) {
   opj_codec_t* codec = opj_create_decompress(OPJ_CODEC_JP2);
   opj_set_info_handler(codec, messageHandler, NULL);
   opj_set_warning_handler(codec, messageHandler, NULL);
   opj_set_error_handler(codec, messageHandler, NULL);

   opj_dparameters_t params;
   opj_set_default_decoder_parameters(&params);
   opj_setup_decoder(codec, &params);

   opj_stream_t* stream = streamCreate();
   if (
      !opj_read_header(stream, codec, &jp2Image) ||
      !opj_decode(codec, stream, jp2Image) ||
      !opj_end_decompress(codec, stream)
   ) {
      abort();
   }

   opj_stream_destroy(stream);
   opj_destroy_codec(codec);
   return jp2Image->color_space;
}

EMSCRIPTEN_KEEPALIVE unsigned getJP2Planes(void) {
   return jp2Image->numcomps;
}

EMSCRIPTEN_KEEPALIVE int32_t* getJP2Data(unsigned plane) {
   return jp2Image->comps[plane].data;
}

EMSCRIPTEN_KEEPALIVE unsigned getJP2Width(unsigned plane) {
   return jp2Image->comps[plane].w;
}

EMSCRIPTEN_KEEPALIVE unsigned getJP2Height(unsigned plane) {
   return jp2Image->comps[plane].h;
}

EMSCRIPTEN_KEEPALIVE unsigned getJP2Bitdepth(unsigned plane) {
   return jp2Image->comps[plane].prec;
}
