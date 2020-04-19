import { readBlob, createImageData } from '../util';
import webpInit from '../../wasm/webp';

export async function decodeWithWebp(file: Blob): Promise<ImageData> {
   const webp = webpInit();
   await webp.promise;
   const data = await readBlob(file);
   const dataPtr = webp.webpAllocate(data.byteLength);
   webp.HEAPU8.set(new Uint8Array(data), dataPtr);
   const imagePtr = webp.webpDecode(dataPtr, data.byteLength);
   const width = webp.webpWidth();
   const height = webp.webpHeight();
   const image = createImageData(width, height);
   image.data.set(webp.HEAPU8.subarray(imagePtr, imagePtr + width * height * 4));
   return image;
}
