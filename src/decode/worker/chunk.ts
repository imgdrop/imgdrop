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
