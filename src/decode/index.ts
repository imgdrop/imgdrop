import { decodeWithImage } from './image';
import { decodeWithHeader } from './header';
import { fileExtension } from '../util';

export async function decodeImage(file: File): Promise<ImageData> {
   try {
      return await decodeWithImage(file);
   } catch (error) {
      console.warn(error);
   }

   try {
      return await decodeWithHeader(file);
   } catch (error) {
      console.warn(error);
   }

   throw new Error(`Failed to read image with extension: ${fileExtension(file.name)}`);
}
