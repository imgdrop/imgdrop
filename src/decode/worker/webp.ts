import js from '../../../wasm/webp/webp';
import wasm from '../../../wasm/webp/webp.wasm';
import { loadWasmModule } from '../../util/wasm';

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
   // TODO: copy HEAPU8 here and transfer it instead
   // (right now its making a copy of the whole WebAssembly.Memory buffer)
   return {
      data: module.HEAPU8.subarray(dataPtr, dataPtr + width * height * 4),
      width,
      height,
   };
}
