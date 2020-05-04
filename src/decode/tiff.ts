import { uploadRGBA } from '../color/rgba';
import { checkData } from '../util/data';
import { callWorker } from './worker/worker';

export function checkTiffImage(header: Uint8Array): boolean {
   return (
      checkData(header, [0x49, 0x49, 0x2a, 0x00]) ||
      checkData(header, [0x4d, 0x4d, 0x00, 0x2a])
   );
}

export async function decodeTiffImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height } = await callWorker({
      name: 'decodeTiffImage',
      args: [file],
   });
   return uploadRGBA(data, width, height);
}
