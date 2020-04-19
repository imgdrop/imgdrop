import { createContext } from '../util';

export function decodeWithImage(file: Blob): Promise<ImageData> {
   return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
         const ctx = createContext(image.width, image.height);
         ctx.drawImage(image, 0, 0);
         resolve(ctx.getImageData(0, 0, image.width, image.height));
         URL.revokeObjectURL(image.src);
      };

      image.onerror = event => {
         if (typeof event === 'string') {
            reject(new Error(event));
         } else {
            reject(new Error('Failed to load image'));
         }
         URL.revokeObjectURL(image.src);
      };
   });
}
