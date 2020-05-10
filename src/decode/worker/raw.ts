// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import js from '../../../wasm/raw/raw';
import wasm from '../../../wasm/raw/raw.wasm';
import { loadWasmModule } from '../../util/wasm';

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
