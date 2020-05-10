// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { uploadPlanarGray } from '../color/gray';
import { uploadGrayAlpha, uploadRGB, uploadRGBA } from '../color/rgba';
import { callWorker } from './worker/worker';

const validType = [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37];
const validSpace = [0x09, 0x0a, 0x0b, 0x0d, 0x20];

export function checkPNMImage(header: Uint8Array): boolean {
   return (
      header[0] === 0x50 &&
      validType.includes(header[1]) &&
      validSpace.includes(header[2])
   );
}

export async function decodePNMImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height, format } = await callWorker({
      name: 'decodePNMImage',
      args: [file],
   });

   switch (format) {
      case 'BLACKANDWHITE':
      case 'GRAYSCALE':
         return uploadPlanarGray(data, {
            offset: 0,
            width,
            height,
         });
      case 'RGB':
         return uploadRGB(data, width, height);
      case 'BLACKANDWHITE_ALPHA':
      case 'GRAYSCALE_ALPHA':
         return uploadGrayAlpha(data, width, height);
      case 'RGB_ALPHA':
         return uploadRGBA(data, width, height);
      default:
         throw new Error(`Unknown PNM format: ${format}`);
   }
}
