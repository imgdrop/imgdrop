import { WorkerExports, WorkerMessage } from './types';
import * as webp from './webp';

const workerExports: WorkerExports = {
   ...webp,
};

onmessage = async (event): Promise<void> => {
   try {
      const data = event.data as WorkerMessage<keyof WorkerExports>;
      const result = await workerExports[data.name](...data.args);
      (postMessage as Function)(result, [result.data.buffer]);
   } catch (error) {
      console.warn(error);
      setTimeout(() => {
         throw error;
      });
   }
};
