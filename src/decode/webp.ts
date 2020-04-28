import { uploadRGBA } from '../color/rgba';
import { checkData } from '../util/data';
import { callWorker } from './worker/worker';

export function checkWebpImage(header: Uint8Array): boolean {
   return (
      checkData(header, [0x52, 0x49, 0x46, 0x46]) &&
      checkData(header, [0x57, 0x45, 0x42, 0x50], 8)
   );
}

export async function decodeWebpImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height } = await callWorker({
      name: 'decodeWebpImage',
      args: [file],
   });
   return uploadRGBA(data, width, height);
}
