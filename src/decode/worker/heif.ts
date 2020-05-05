import js from '../../../wasm/heif/heif';
import wasm from '../../../wasm/heif/heif.wasm';
import { loadWasmModule } from '../../util/wasm';

/* eslint-disable no-underscore-dangle */

export async function decodeHeifImage(
   file: File
): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
}> {
   const module = await loadWasmModule(js, wasm, file);
   const dataPtr = module._decodeHeifImage();
   const width = module._getHeifWidth();
   const height = module._getHeifHeight();
   return {
      data: module.HEAPU8.slice(dataPtr, dataPtr + width * height * 4),
      width,
      height,
   };
}
