import { TupleType } from '@imgdrop/pnm';
import { readBlobData } from '../../util/data';
import { fixupData } from '../../color/fixup';

declare class FileReaderSync {
   readAsArrayBuffer(file: Blob): ArrayBuffer;
}

export async function decodePNMImage(file: File): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
   format: TupleType;
}> {
   const pnm = await import(/* webpackChunkName: 'pnm' */ '@imgdrop/pnm');

   let offset = 0;
   const reader = new FileReaderSync();
   const decoder = new pnm.PNMDecoder(size => {
      const buffer = reader.readAsArrayBuffer(file.slice(offset, offset + size));
      offset += buffer.byteLength;
      return buffer;
   });
   decoder.decode();

   const data = new Uint8Array(decoder.data.buffer);
   fixupData(data, decoder.data, {
      width: decoder.width * decoder.depth,
      height: decoder.height,
      maxval: decoder.maxval
   });
   return {
      data,
      width: decoder.width,
      height: decoder.height,
      format: decoder.tupltype
   };
}
