#ifndef WASM_UTIL_H
#define WASM_UTIL_H
#include <emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>

#define INPUT_PATH "/wfs/input"

static void* readInput(size_t* size) {
   int file = open(INPUT_PATH, O_RDONLY);
   struct stat stats;
   fstat(file, &stats);
   *size = stats.st_size;
   void* data = malloc(*size);
   read(file, data, *size);
   close(file);
   return data;
}

#endif
