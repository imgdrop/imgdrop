import { readBlob, createImageData } from '../util';

export async function decodeWithUtif(file: Blob): Promise<ImageData> {
   const utif = await import('utif');
   const data = await readBlob(file);
   for (const ifd of utif.decode(data)) {
      utif.decodeImage(data, ifd);
      if (ifd.width === undefined || ifd.height === undefined) {
         continue;
      }

      const image = createImageData(ifd.width, ifd.height);
      image.data.set(utif.toRGBA8(ifd));
      return image;
   }
   throw new Error('Could not find image');
}
