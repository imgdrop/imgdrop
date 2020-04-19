import { createContext } from './util';

export function encodeImage(image: ImageData): Promise<Blob> {
   return new Promise((resolve, reject) => {
      const ctx = createContext(image.width, image.height);
      ctx.putImageData(image, 0, 0);
      ctx.canvas.toBlob(blob => {
         if (blob === null) {
            reject(new Error('Failed to create blob'));
         } else {
            resolve(blob);
         }
      }, 'image/png');
   });
}
