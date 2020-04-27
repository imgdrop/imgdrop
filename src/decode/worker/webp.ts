import js from '../../../wasm/webp/webp';
import { loadWasmModule } from '../../util/wasm';
import wasm from '../../wasm/webp/webp.wasm';

/* eslint-disable no-underscore-dangle */

export async function decodeWebpImage(
   file: File
): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
}> {
   const module = await loadWasmModule(js, wasm, file);
   const dataPtr = module._decodeWebpImage();
   const width = module._getWebpWidth();
   const height = module._getWebpHeight();
   return {
      data: module.HEAPU8.subarray(dataPtr, dataPtr + width * height * 4),
      width,
      height,
   };
}
