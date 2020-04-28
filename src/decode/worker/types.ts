export interface WorkerExports {
   decodeWebpImage(
      file: File
   ): Promise<{ data: Uint8Array; width: number; height: number }>;
}

export interface WorkerMessage<E extends keyof WorkerExports> {
   name: E;
   args: Parameters<WorkerExports[E]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkerPostMessage = (data: any) => void;
