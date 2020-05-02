import { uploadPlanarRGBA } from '../color/rgba';
import { callWorker } from './worker/worker';

export async function decodeJP2Image(file: File): Promise<HTMLCanvasElement> {
   const { data, format, planes } = await callWorker({
      name: 'decodeJP2Image',
      args: [file],
   });

   switch (format) {
      case 'rgb':
         return uploadPlanarRGBA(data, planes[0], planes[1], planes[2], planes[3]);
      default:
         throw new Error(`Unknown JP2 worker format: ${format}`);
   }
}
