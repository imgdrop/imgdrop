import { readImage, setupBrowser } from '@imgdrop/image-night';
import { createImageData } from '../util';

setupBrowser(new Worker('./image-night.worker', { type: 'module' }));

export async function decodeWithImageNight(file: File): Promise<ImageData> {
   console.log('Trying Image Night...');
   const data = await readImage(file);
   const image = createImageData(data.width, data.height);
   image.data.set(data.data);
   return image;
}
