// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { uploadRGBA } from '../color/rgba';
import { checkData } from '../util/data';
import { callWorker } from './worker/worker';

export function checkDDSImage(header: Uint8Array): boolean {
   return checkData(header, [0x44, 0x44, 0x53, 0x20, 0x7c, 0x00, 0x00, 0x00]);
}

export async function decodeDDSImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height } = await callWorker({
      name: 'decodeDDSImage',
      args: [file],
   });
   return uploadRGBA(data, width, height);
}
