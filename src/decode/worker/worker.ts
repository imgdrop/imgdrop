// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getPathExtension } from '../../util/path';
import { WorkerExports, WorkerMessage, WorkerReturn } from './types';

let decodeWorker: Worker;
if (typeof Worker === 'function') {
   decodeWorker = new Worker('./chunk', { type: 'module' });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function niceStringify(data: any): string {
   return JSON.stringify(
      data,
      (key, value) => {
         if (value instanceof File) {
            return `<file with extension ${getPathExtension(value.name)}>`;
         }
         if (value instanceof Uint8Array) {
            return `<${value.length} byte array>`;
         }
         return value;
      },
      3
   );
}

export function callWorker<E extends keyof WorkerExports>(
   data: WorkerMessage<E>
): Promise<WorkerReturn<E>> {
   return new Promise((resolve, reject) => {
      console.debug(`Worker call: ${niceStringify(data)}`);
      decodeWorker.onmessage = (event): void => {
         const result = event.data as WorkerReturn<E>;
         console.debug(`Worker message: ${niceStringify(result)}`);
         resolve(result);
      };
      decodeWorker.onerror = (event): void => {
         event.preventDefault();
         reject(new Error(event.message));
      };
      decodeWorker.postMessage(data);
   });
}
