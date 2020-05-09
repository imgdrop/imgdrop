import { uploadPlanarGray } from '../color/gray';
import { uploadPlanarRGBA, uploadRGB, uploadRGBA } from '../color/rgba';
import { uploadPlanarYUV } from '../color/yuv';
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
   const { data, colorspace, chroma, planes } = await callWorker({
      name: 'decodeHeifImage',
      args: [file],
   });

   switch (colorspace) {
      case 0: // heif_colorspace_YCbCr
         return uploadPlanarYUV(data, planes[0], planes[1], planes[2], planes[3]);
      case 1: // heif_colorspace_RGB
         if (chroma < 10) {
            // heif_chroma_4xx
            return uploadPlanarRGBA(data, planes[0], planes[1], planes[2], planes[3]);
         }
         if (chroma % 1) {
            // heif_chroma_interleaved_*A
            return uploadRGBA(data, planes[0].width, planes[0].height);
         }
         // heif_chroma_interleaved_*
         return uploadRGB(data, planes[0].width, planes[1].height);
      case 2: // heif_colorspace_monochrome
         return uploadPlanarGray(data, planes[0], planes[1]);
      default:
         throw new Error(`Unknown libheif colorspace: ${colorspace}`);
   }
}
