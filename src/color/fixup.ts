/* eslint-disable no-param-reassign, no-bitwise */

export interface FixupConfig {
   width: number;
   height: number;
   stride?: number;
   depth?: number;
   maxval?: number;
   swap?: boolean;
}

export type FixupBuffer =
   | Int8Array
   | Uint8Array
   | Int16Array
   | Uint16Array
   | Int32Array
   | Uint32Array;

export function fixupData(
   output: Uint8Array,
   input: FixupBuffer,
   {
      width,
      height,
      stride = width,
      depth = 8,
      maxval = (1 << depth) - 1,
      swap = false,
   }: FixupConfig
): void {
   for (let y = 0; y < height; y += 1) {
      if (maxval === 0xff) {
         output.set(input.subarray(y * stride, y * stride + width), y * width);
      } else {
         for (let x = 0; x < width; x += 1) {
            let value = input[y * stride + x];
            if (swap) {
               value = (value >> 8) | ((value & 0xff) << 8);
            }
            output[y * width + x] = (value * 0xff) / maxval;
         }
      }
   }
}
