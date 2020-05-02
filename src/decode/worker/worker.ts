import { getPathExtension } from '../../util/path';
import { WorkerExports, WorkerMessage } from './types';

let decodeWorker: Worker;
if (typeof Worker === 'function') {
   decodeWorker = new Worker('./chunk', { type: 'module' });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function niceStringify(data: any): string {
   return JSON.stringify(
      data,
      (key, value) => {
         if (key === 'path') {
            return `<removed>.${getPathExtension(value)}`;
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
): Promise<ReturnType<WorkerExports[E]>> {
   return new Promise((resolve, reject) => {
      console.log(`Worker call: ${niceStringify(data)}`);
      decodeWorker.onmessage = (event): void => {
         console.log(`Worker message: ${niceStringify(event.data)}`);
         resolve(event.data);
      };
      decodeWorker.onerror = (event): void => reject(new Error(event.message));
      decodeWorker.postMessage(data);
   });
}
