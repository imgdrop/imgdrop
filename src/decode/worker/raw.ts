import js from '../../../wasm/raw/raw';
import wasm from '../../../wasm/raw/raw.wasm';
import { loadWasmModule } from '../../util/wasm';

/* eslint-disable no-underscore-dangle */

export async function decodeRawImage(
   file: File
): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
}> {
   const module = await loadWasmModule(js, wasm, file);
   module._decodeRawImage();
   const width = module._getRawWidth();
   const height = module._getRawHeight();
   return {
      data: module.output,
      width,
      height,
   };
}
