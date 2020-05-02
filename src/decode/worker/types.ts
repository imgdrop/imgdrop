import { ColorPlane } from '../../color/types';

export type JP2Format = 'rgb' | 'gray' | 'yuv' | 'cmyk';

export interface WorkerExports {
   decodeWebpImage(
      file: File
   ): Promise<{ data: Uint8Array; width: number; height: number }>;
   decodeJP2Image(
      file: File
   ): Promise<{ data: Uint8Array; format: JP2Format; planes: ColorPlane[] }>;
}

export interface WorkerMessage<E extends keyof WorkerExports> {
   name: E;
   args: Parameters<WorkerExports[E]>;
}
