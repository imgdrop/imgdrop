import { uploadRGBA } from '../color/rgba';
import { checkData } from '../util/data';
import { callWorker } from './worker/worker';

export function checkHeifImage(header: Uint8Array): boolean {
   // [0x68, 0x65, 0x69, 0x63]
   if (!checkData(header, [0x66, 0x74, 0x79, 0x70], 4)) {
      return false;
   }
   for (let i = 16; i < 32; i += 4) {
      if (
         checkData(header, [0x68, 0x65, 0x69, 0x63], i) ||
         checkData(header, [0x68, 0x65, 0x69, 0x78], i)
      ) {
         return true;
      }
   }
   return false;
}

export async function decodeHeifImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height } = await callWorker({
      name: 'decodeHeifImage',
      args: [file],
   });
   return uploadRGBA(data, width, height);
}
