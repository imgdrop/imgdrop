import { decodeWithImage } from './image';
import { decodeWithHeader } from './header';

export async function decodeImage(file: Blob): Promise<ImageData> {
   try {
      return await decodeWithImage(file);
   } catch (error) {
      console.warn(error);
   }
   return await decodeWithHeader(file);
}
