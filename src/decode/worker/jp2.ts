import js from '../../../wasm/jp2/jp2';
import wasm from '../../../wasm/jp2/jp2.wasm';
import { rescaleDepth } from '../../color/depth';
import { ColorPlane } from '../../color/types';
import { loadWasmModule } from '../../util/wasm';
import { JP2Format } from './types';

/* eslint-disable no-underscore-dangle */

function getFormatString(format: number): JP2Format {
   switch (format) {
      case 1:
         return 'rgb';
      case 2:
         return 'gray';
      case 3:
      case 4:
         return 'yuv';
      case 5:
         return 'cmyk';
      default:
         throw new Error(`Unknown OpenJPEG format: ${format}`);
   }
}

export async function decodeJP2Image(
   file: File
): Promise<{ data: Uint8Array; format: JP2Format; planes: ColorPlane[] }> {
   const module = await loadWasmModule(js, wasm, file);
   const format = getFormatString(module._decodeJP2Image());
   const planeCount = module._getJP2Planes();
   const planes: ColorPlane[] = [];
   let dataSize = 0;
   for (let i = 0; i < planeCount; i += 1) {
      const width = module._getJP2Width(i);
      const height = module._getJP2Height(i);
      planes.push({
         offset: dataSize,
         width,
         height,
      });
      dataSize += width * height;
   }

   const data = new Uint8Array(dataSize);
   planes.forEach((plane, index) => {
      // eslint-disable-next-line no-bitwise
      const dataPtr = module._getJP2Data(index) >> 2;
      rescaleDepth(
         module._getJP2Bitdepth(index),
         module.HEAP32.subarray(dataPtr, dataPtr + plane.width * plane.height),
         data.subarray(plane.offset)
      );
   });
   return {
      data,
      format,
      planes,
   };
}
