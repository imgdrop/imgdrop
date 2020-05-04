#ifndef WASM_RAW_OUTPUT_H
#define WASM_RAW_OUTPUT_H
#include "../util.h"

EM_JS(void, outputCreate, (uint16_t width, uint16_t height), {
   Module['output'] = new Uint8Array(width * height * 3);
   var prefix = ('P6\n'+width+' '+height+'\n255\n').length;
   var dev = FS.makedev(73, 68);
   FS.registerDevice(dev, {
      write: function(stream, buffer, offset, length, position) {
         var end = offset + length;
         position -= prefix;
         if (position < 0) {
            offset -= position;
            position = 0;
         }
         if (offset >= end) {
            return length;
         }
         Module['output'].set(buffer.subarray(offset, end), position);
         return length;
      }
   });
   FS.mkdev('/output', dev);
});

#endif
