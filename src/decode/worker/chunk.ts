import * as jp2 from './jp2';
import * as raw from './raw';
import { WorkerExports, WorkerMessage } from './types';
import * as webp from './webp';

const workerExports: WorkerExports = {
   ...webp,
   ...jp2,
   ...raw,
};

onmessage = async (event): Promise<void> => {
   try {
      const data = event.data as WorkerMessage<keyof WorkerExports>;
      const result = await (workerExports[data.name] as Function)(...data.args);
      (postMessage as Function)(result, [result.data.buffer]);
   } catch (error) {
      console.warn(error);
      setTimeout(() => {
         throw error;
      });
   }
};
