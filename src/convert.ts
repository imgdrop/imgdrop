import { decodeImage } from './decode/decode';
import { getPathBasename } from './util/path';

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

export async function convertImage(file: File): Promise<void> {
   const image = await decodeImage(file);
   const blob = await encodeImage(image, 'image/png');
   const link = document.createElement('a');
   link.href = URL.createObjectURL(blob);
   link.download = `${getPathBasename(file.name)}.png`;
   link.click();
   URL.revokeObjectURL(link.href);
}
