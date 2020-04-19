import { decodeWithImage } from './image';
import { decodeWithHeader } from './header';

export async function decodeImage(file: Blob): Promise<ImageData> {
   try {
      return await decodeWithImage(file);
   } catch (error) {
      console.warn('Failed to decode with image:', error);
   }

   try {
      return await decodeWithHeader(file);
   } catch (error) {
      console.warn('Failed to decode with UTIF:', error);
   }

   throw new Error('Failed to read image');
}
