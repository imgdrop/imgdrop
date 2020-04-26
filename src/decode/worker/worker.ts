import { WorkerExports, WorkerMessage } from './types';

const decodeWorker = new Worker('./chunk', { type: 'module' });

export function callWorker<E extends keyof WorkerExports>(
   data: WorkerMessage<E>
): Promise<ReturnType<WorkerExports[E]>> {
   return new Promise((resolve, reject) => {
      decodeWorker.onmessage = (event): void => resolve(event.data);
      decodeWorker.onerror = (event): void => reject(new Error(event.message));
      decodeWorker.postMessage(data);
   });
}
