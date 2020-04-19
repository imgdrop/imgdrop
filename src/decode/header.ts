import { readBlob } from '../util';
import { decodeWithWebp } from './webp';
import { decodeWithUtif } from './utif';

export async function decodeWithHeader(file: Blob): Promise<ImageData> {
   const headerBuffer = new Uint8Array(await readBlob(file.slice(0, 12)));
   const header = String.fromCharCode(...Array.from(headerBuffer));
   if (/RIFF.{4}WEBP/s.test(header)) {
      return await decodeWithWebp(file);
   } else if (/II\*\0|MM\0\*/s.test(header)) {
      return await decodeWithUtif(file);
   } else {
      throw new Error(`Failed to detect header: ${headerBuffer}`);
   }
}
