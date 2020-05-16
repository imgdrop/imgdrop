// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createSyncDataReader } from '../../util/data';

export async function decodeDDSImage(
   file: File
): Promise<{
   data: Uint8Array;
   width: number;
   height: number;
}> {
   const dds = await import(/* webpackChunkName: 'dds' */ '@imgdrop/dds');
   const decoder = new dds.DDSDecoder(createSyncDataReader(file));
   decoder.decode();
   return {
      data: decoder.data,
      width: decoder.width,
      height: decoder.height,
   };
}
