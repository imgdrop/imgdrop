// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { TupleType } from '@imgdrop/pnm';
import { fixupData } from '../../color/fixup';
import { createSyncDataReader } from '../../util/data';

export async function decodePNMImage(
   file: File
): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
   format: TupleType;
}> {
   const pnm = await import(/* webpackChunkName: 'pnm' */ '@imgdrop/pnm');
   const decoder = new pnm.PNMDecoder(createSyncDataReader(file));
   decoder.decode();

   const data = new Uint8Array(decoder.data.buffer);
   const fixupWidth = decoder.width * decoder.depth;
   fixupData(data, decoder.data, {
      width: fixupWidth,
      height: decoder.height,
      maxval: decoder.maxval,
   });
   return {
      data: data.subarray(0, fixupWidth * decoder.height),
      width: decoder.width,
      height: decoder.height,
      format: decoder.tupltype,
   };
}
