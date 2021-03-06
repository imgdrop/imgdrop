// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { readBlobData } from '../../util/data';

const supportedPhotometric = [0, 1, 2, 3, 4];
const supportedCompression = [1, 3, 4, 5, 6, 7, 8, 32773, 32809];

export async function decodeTiffImage(
   file: File
): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
}> {
   const utif = await import(/* webpackChunkName: 'utif' */ 'utif');
   const buffer = await readBlobData(file);
   const ifd = utif.decode(buffer)[0];
   const compression = ifd.t259 as [number];
   if (compression[0] === 32946) {
      compression[0] = 8;
      console.warn('Guessed TIFF compression: ZLib');
   }
   if (!supportedCompression.includes(compression[0])) {
      throw new Error(`Unsupported compression: ${compression[0]}`);
   }

   utif.decodeImage(buffer, ifd);
   if (ifd.data === undefined) {
      throw new Error(`Failed to decode IFD`);
   }

   // TODO: support YUV
   const photometric = ifd.t262 as [number];
   if (!supportedPhotometric.includes(photometric[0])) {
      throw new Error(`Unsupported photometric interpretation: ${photometric[0]}`);
   }

   return {
      data: utif.toRGBA8(ifd),
      width: ifd.width,
      height: ifd.height,
   };
}
