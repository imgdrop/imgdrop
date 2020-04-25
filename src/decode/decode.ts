import { getPathExtension } from '../util/path';
import { decodeHTMLImage } from './html';

export async function decodeImage(file: File): Promise<HTMLCanvasElement> {
   try {
      return await decodeHTMLImage(file);
   } catch (error) {
      console.warn(error);
   }

   console.log(`Mimetype: ${file.type}`);
   throw new Error(
      `Failed to decode image with extension: ${getPathExtension(file.name)}`
   );
}
