// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { readBlobData } from '../util/data';
import { getPathExtension } from '../util/path';
import { checkHeifImage, decodeHeifImage } from './heif';
import { decodeHTMLImage } from './html';
import { checkJP2Image, decodeJP2Image } from './jp2';
import { decodeRawImage } from './raw';
import { checkTiffImage, decodeTiffImage } from './tiff';
import { checkWebpImage, decodeWebpImage } from './webp';

export async function decodeImage(file: File): Promise<HTMLCanvasElement> {
   console.log(`Mimetype: ${file.type}`);
   console.log(`Extension: ${getPathExtension(file.name)}`);

   console.debug('Trying HTML decoder...');
   try {
      return await decodeHTMLImage(file);
   } catch (error) {
      console.warn(error);
   }

   const header = new Uint8Array(await readBlobData(file.slice(0, 32)));
   if (checkWebpImage(header)) {
      console.debug('Trying WebP decoder...');
      return decodeWebpImage(file);
   }

   const jp2Codec = checkJP2Image(header);
   if (jp2Codec >= 0) {
      console.debug('Trying JPEG 2000 decoder...');
      return decodeJP2Image(file, jp2Codec);
   }

   if (checkHeifImage(header)) {
      console.debug('Trying HEIF decoder...');
      return decodeHeifImage(file);
   }

   console.debug('Trying LibRaw decoder...');
   try {
      return await decodeRawImage(file);
   } catch (error) {
      console.warn(error);
   }

   if (checkTiffImage(header)) {
      console.debug('Trying TIFF decoder...');
      return decodeTiffImage(file);
   }

   throw new Error(
      `Failed to decode image with extension: ${getPathExtension(file.name)}`
   );
}
