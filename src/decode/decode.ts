import { readBlobData } from '../util/data';
import { getPathExtension } from '../util/path';
import { decodeHTMLImage } from './html';
import { checkJP2Image, decodeJP2Image } from './jp2';
import { decodeRawImage } from './raw';
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

   const header = new Uint8Array(await readBlobData(file.slice(0, 12)));
   if (checkWebpImage(header)) {
      console.debug('Trying WebP decoder...');
      return decodeWebpImage(file);
   }

   const jp2Codec = checkJP2Image(header);
   if (jp2Codec >= 0) {
      console.debug('Trying JPEG 2000 decoder...');
      return decodeJP2Image(file, jp2Codec);
   }

   console.debug('Trying LibRaw decoder...');
   try {
      return await decodeRawImage(file);
   } catch (error) {
      console.warn(error);
   }

   throw new Error(
      `Failed to decode image with extension: ${getPathExtension(file.name)}`
   );
}
