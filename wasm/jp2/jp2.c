#include "../util.h"
#include "stream.h"
#include "openjpeg/src/lib/openjp2/openjpeg.h"

static opj_image_t* jp2Image;

EM_JS(void, infoHandler, (const char* msg, void* user), {
   console.debug(UTF8ToString(msg));
});

EM_JS(void, warningHandler, (const char* msg, void* user), {
   console.warn(UTF8ToString(msg));
});

EM_JS(void, errorHandler, (const char* msg, void* user), {
   console.error(UTF8ToString(msg));
});

EMSCRIPTEN_KEEPALIVE OPJ_COLOR_SPACE decodeJP2Image(OPJ_CODEC_FORMAT codecType) {
   opj_codec_t* codec = opj_create_decompress(codecType);
   opj_set_info_handler(codec, infoHandler, NULL);
   opj_set_warning_handler(codec, warningHandler, NULL);
   opj_set_error_handler(codec, errorHandler, NULL);

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
