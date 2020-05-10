// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import js from '../../../wasm/webp/webp';
import wasm from '../../../wasm/webp/webp.wasm';
import { loadWasmModule } from '../../util/wasm';

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
      data: module.HEAPU8.slice(dataPtr, dataPtr + width * height * 4),
      width,
      height,
   };
}
