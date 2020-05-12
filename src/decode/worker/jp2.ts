// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import js from '../../../wasm/jp2/jp2';
import wasm from '../../../wasm/jp2/jp2.wasm';
import { fixupData } from '../../color/fixup';
import { ColorPlane } from '../../color/types';
import { loadWasmModule } from '../../util/wasm';

export async function decodeJP2Image(
   file: File,
   codec: number
): Promise<{ data: Uint8Array; format: number; planes: ColorPlane[] }> {
   const module = await loadWasmModule(js, wasm, file);
   const format = module._decodeJP2Image(codec);
   const planeCount = module._getJP2Planes();
   const planes: ColorPlane[] = [];
   let dataSize = 0;
   for (let i = 0; i < planeCount; i += 1) {
      const width = module._getJP2Width(i);
      const height = module._getJP2Height(i);
      planes.push({
         offset: dataSize,
         width,
         height,
      });
      dataSize += width * height;
   }

   const data = new Uint8Array(dataSize);
   planes.forEach((plane, index) => {
      // eslint-disable-next-line no-bitwise
      const dataPtr = module._getJP2Data(index) >>> 2;
      fixupData(data.subarray(plane.offset), module.HEAP32.subarray(dataPtr), {
         width: plane.width,
         height: plane.height,
         depth: module._getJP2Bitdepth(index),
      });
   });
   return {
      data,
      format,
      planes,
   };
}
