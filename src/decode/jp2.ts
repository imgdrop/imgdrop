import { uploadPlanarRGBA } from '../color/rgba';
import { checkData } from '../util/data';
import { callWorker } from './worker/worker';

export function checkJP2Image(header: Uint8Array): number {
   // prettier-ignore
   const jp2Magic = [
      0x00, 0x00, 0x00, 0x0C,
      0x6A, 0x50, 0x20, 0x20,
      0x0D, 0x0A, 0x87, 0x0A,
   ];

   if (checkData(header, jp2Magic) || checkData(header, [0x0d, 0x0a, 0x87, 0x0a])) {
      return 2; // OPJ_CODEC_JP2
   }
   if (checkData(header, [0xff, 0x4f, 0xff, 0x51])) {
      return 0; // OPJ_CODEC_J2K
   }
   return -1; // OPJ_CODEC_UNKNOWN
}

export async function decodeJP2Image(
   file: File,
   codec: number
): Promise<HTMLCanvasElement> {
   const { data, format, planes } = await callWorker({
      name: 'decodeJP2Image',
      args: [file, codec],
   });

   let guessedFormat = format;
   if (guessedFormat === 0) {
      // OPJ_CLRSPC_UNSPECIFIED
      console.warn('JPEG 2000 format not specified');
      if (planes.length <= 2) {
         guessedFormat = 2; // OPJ_CLRSPC_GRAY
      } else if (planes[0].width !== planes[1].width) {
         guessedFormat = 3; // OPJ_CLRSPC_SYCC
      } else {
         guessedFormat = 1; // OPJ_CLRSPC_SRGB
      }
   }

   switch (guessedFormat) {
      case 1: // OPJ_CLRSPC_SRGB
         return uploadPlanarRGBA(data, planes[0], planes[1], planes[2], planes[3]);
      default:
         throw new Error(`Unknown OpenJPEG format: ${guessedFormat}`);
   }
}
