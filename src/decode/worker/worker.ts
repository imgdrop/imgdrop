import { WorkerExports, WorkerMessage } from './types';

let decodeWorker: Worker;
if (typeof Worker === 'function') {
   decodeWorker = new Worker('./chunk', { type: 'module' });
}

export function callWorker<E extends keyof WorkerExports>(
   data: WorkerMessage<E>
): Promise<ReturnType<WorkerExports[E]>> {
   return new Promise((resolve, reject) => {
      decodeWorker.onmessage = (event): void => reject(event.data);
      decodeWorker.onerror = (event): void => reject(new Error(event.message));
      decodeWorker.postMessage(data);
   });
}
