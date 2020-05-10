// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { WorkerExports, WorkerMessage, WorkerReturn, workerExports } from './types';

onmessage = async (event): Promise<void> => {
   try {
      const data = event.data as WorkerMessage<keyof WorkerExports>;
      const result = (await (workerExports[data.name] as Function)(
         ...data.args
      )) as WorkerReturn<keyof WorkerExports>;
      (postMessage as Function)(result, [result.data.buffer]);
   } catch (error) {
      console.warn(error);
      setTimeout(() => {
         throw error;
      });
   }
};
