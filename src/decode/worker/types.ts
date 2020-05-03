import { ColorPlane } from '../../color/types';

export interface WorkerExports {
   decodeWebpImage(
      file: File
   ): Promise<{ data: Uint8Array; width: number; height: number }>;
   decodeJP2Image(
      file: File,
      codec: number
   ): Promise<{ data: Uint8Array; format: number; planes: ColorPlane[] }>;
}

export interface WorkerMessage<E extends keyof WorkerExports> {
   name: E;
   args: Parameters<WorkerExports[E]>;
}
