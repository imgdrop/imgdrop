import { uploadRGB } from '../color/rgba';
import { callWorker } from './worker/worker';

export async function decodeRawImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height } = await callWorker({
      name: 'decodeRawImage',
      args: [file],
   });
   return uploadRGB(data, width, height);
}
