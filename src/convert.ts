// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { decodeImage } from './decode/decode';
import { getPathBasename } from './util/path';

let currentConversion = Promise.resolve();

function encodeImage(image: HTMLCanvasElement, type: string): Promise<Blob> {
   return new Promise((resolve, reject) => {
      image.toBlob((blob) => {
         if (blob === null) {
            reject(new Error('Failed to encode image'));
         } else {
            resolve(blob);
         }
      }, type);
   });
}

async function convertImageQueued(file: File): Promise<void> {
   try {
      await currentConversion;
   } catch (error) {
      console.warn('Previous conversion failed:', error);
   }

   const startTime = performance.now();
   const image = await decodeImage(file);
   const blob = await encodeImage(image, 'image/png');
   const link = document.createElement('a');
   link.href = URL.createObjectURL(blob);
   link.download = `${getPathBasename(file.name)}.png`;
   link.click();
   URL.revokeObjectURL(link.href);
   console.log(`Conversion time: ${Math.ceil(performance.now() - startTime)}ms`);
}

export function convertImage(file: File): Promise<void> {
   currentConversion = convertImageQueued(file);
   return currentConversion;
}
