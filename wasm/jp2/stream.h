#ifndef WASM_JP2_STREAM_H
#define WASM_JP2_STREAM_H
#include "../util.h"
#include "openjpeg/src/lib/openjp2/openjpeg.h"

static void streamFree(void* file) {
   fclose(file);
}

static OPJ_SIZE_T streamRead(void* data, OPJ_SIZE_T size, void* file) {
   size_t read = fread(data, 1, size, file);
   if (read == 0) {
      return (OPJ_SIZE_T)-1;
   }
   return read;
}

static OPJ_OFF_T streamSkip(OPJ_OFF_T skip, void* file) {
   if (fseeko(file, skip, SEEK_CUR) == 0) {
      return skip;
   }
   return -1;
}

static OPJ_BOOL streamSeek(OPJ_OFF_T pos, void* file) {
   return fseeko(file, pos, SEEK_SET) == 0;
}

static opj_stream_t* streamCreate(void) {
   FILE* file = fopen(INPUT_PATH, "rb");
   struct stat stats;
   fstat(fileno(file), &stats);

   opj_stream_t* stream = opj_stream_create(OPJ_J2K_STREAM_CHUNK_SIZE, true);
   opj_stream_set_user_data(stream, file, streamFree);
   opj_stream_set_user_data_length(stream, stats.st_size);
   opj_stream_set_read_function(stream, streamRead);
   opj_stream_set_skip_function(stream, streamSkip);
   opj_stream_set_seek_function(stream, streamSeek);
   return stream;
}

#endif
