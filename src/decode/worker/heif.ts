// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import js from '../../../wasm/heif/heif';
import wasm from '../../../wasm/heif/heif.wasm';
import { fixupData } from '../../color/fixup';
import { ColorPlane } from '../../color/types';
import { loadWasmModule } from '../../util/wasm';

const rgbMappings = [3, 4, 5, 3, 4, 5, 6, 7, 8, 9, 10];
const chromaPlanes = [
   [0], // heif_chroma_monochrome
   [0, 1, 2], // heif_chroma_420
   [0, 1, 2], // heif_chroma_422
   [0, 1, 2], // heif_chroma_444
   [10], // heif_chroma_interleaved_RGB
   [10], // heif_chroma_interleaved_RGBA
   [10], // heif_chroma_interleaved_RRGGBB_BE
   [10], // heif_chroma_interleaved_RRGGBBAA_BE
   [10], // heif_chroma_interleaved_RRGGBB_LE
   [10], // heif_chroma_interleaved_RRGGBBAA_LE
];
const chromaFixup = [
   {
      // heif_chroma_monochrome
      widthMul: 1,
   },
   {
      // heif_chroma_420
      widthMul: 1,
   },
   {
      // heif_chroma_422
      widthMul: 1,
   },
   {
      // heif_chroma_444
      widthMul: 1,
   },
   {
      // heif_chroma_interleaved_RGB
      widthMul: 3,
   },
   {
      // heif_chroma_interleaved_RGBA
      widthMul: 4,
   },
   {
      // heif_chroma_interleaved_RRGGBB_BE
      widthMul: 3,
      depth: 16,
      swap: true,
   },
   {
      // heif_chroma_interleaved_RRGGBBAA_BE
      widthMul: 4,
      depth: 16,
      swap: true,
   },
   {
      // heif_chroma_interleaved_RRGGBB_LE
      widthMul: 3,
      depth: 16,
   },
   {
      // heif_chroma_interleaved_RRGGBBAA_LE
      widthMul: 4,
      depth: 16,
   },
];

export async function decodeHeifImage(
   file: File
): Promise<{
   data: Uint8Array;
   colorspace: number;
   chroma: number;
   planes: ColorPlane[];
}> {
   const module = await loadWasmModule(js, wasm, file);
   module._decodeHeifImage();
   const colorspace = module._getHeifColorspace();
   const chroma = module._getHeifChroma();
   let planeIds = chromaPlanes[chroma];
   if (colorspace === 1) {
      // heif_colorspace_RGB
      planeIds = planeIds.map((id) => rgbMappings[id]);
   }
   if (module._getHeifData(6) !== 0) {
      // heif_channel_Alpha
      planeIds = [...planeIds, 6];
   }

   let dataSize = 0;
   const planes = planeIds.map((id) => {
      const width = module._getHeifWidth(id);
      const height = module._getHeifHeight(id);
      const plane = {
         offset: dataSize,
         width,
         height,
      };
      dataSize += width * height * chromaFixup[chroma].widthMul;
      return plane;
   });

   const data = new Uint8Array(dataSize);
   planes.forEach((plane, index) => {
      const id = planeIds[index];
      const fixup = chromaFixup[chroma];
      const dataPtr = module._getHeifData(id);
      let input: Uint8Array | Uint16Array;
      let stride = module._getHeifStride(id);
      if (fixup.depth === 16) {
         // eslint-disable-next-line no-bitwise
         input = module.HEAPU16.subarray(dataPtr >>> 1);
         // eslint-disable-next-line no-bitwise
         stride >>>= 1;
      } else {
         input = module.HEAPU8.subarray(dataPtr);
      }

      fixupData(data.subarray(plane.offset), input, {
         width: plane.width * fixup.widthMul,
         height: plane.height,
         stride,
         ...fixup,
      });
   });
   return {
      data,
      colorspace,
      chroma,
      planes,
   };
}
