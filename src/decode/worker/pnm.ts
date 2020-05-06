import { TupleType } from '@imgdrop/pnm';
import { readBlobData } from '../../util/data';
import { rescaleMaxval } from '../../color/depth';

export async function decodePNMImage(file: File): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
   format: TupleType;
}> {
   const pnm = await import(/* webpackChunkName: 'pnm' */ '@imgdrop/pnm');

   let offset = 0;
   const decoder = new pnm.PNMDecoder(async size => {
      const buffer = await readBlobData(file.slice(offset, offset + size));
      offset += buffer.byteLength;
      return new Uint8Array(buffer);
   });
   await decoder.decode();

   const data = new Uint8Array(decoder.data.buffer);
   rescaleMaxval(decoder.maxval, decoder.data, data);
   return {
      data,
      width: decoder.width,
      height: decoder.height,
      format: decoder.tupltype
   };
}
