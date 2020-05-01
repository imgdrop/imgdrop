import { readBlobData } from '../util/data';
import { getPathExtension } from '../util/path';
import { decodeHTMLImage } from './html';
import { checkWebpImage, decodeWebpImage } from './webp';

export async function decodeImage(file: File): Promise<HTMLCanvasElement> {
   console.log(`Mimetype: ${file.type}`);
   console.log(`Extension: ${getPathExtension(file.name)}`);

   console.log('Trying HTML decoder...');
   try {
      return await decodeHTMLImage(file);
   } catch (error) {
      console.warn(error);
   }

   const header = new Uint8Array(await readBlobData(file.slice(0, 12)));
   if (checkWebpImage(header)) {
      console.log('Trying WebP decoder...');
      try {
         return await decodeWebpImage(file);
      } catch (error) {
         console.warn(error);
      }
   }

   throw new Error(
      `Failed to decode image with extension: ${getPathExtension(file.name)}`
   );
}
