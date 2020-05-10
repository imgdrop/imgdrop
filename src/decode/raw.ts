// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { uploadRGB } from '../color/rgba';
import { callWorker } from './worker/worker';

export async function decodeRawImage(file: File): Promise<HTMLCanvasElement> {
   const { data, width, height } = await callWorker({
      name: 'decodeRawImage',
      args: [file],
   });
   return uploadRGB(data, width, height);
}
