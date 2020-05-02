export interface EmscriptenOptions {
   memory?: WebAssembly.Memory;
   locateFile?: (path: string, prefix: string) => string;
   onRuntimeInitialized?: () => void;
}

export type EmscriptenWorkerFilesystem = { __workerfs: true };
export interface EmscriptenWorkerOptions {
   blobs: {
      name: string;
      data: Blob;
   }[];
}

export type EmscriptenModule<T = {}> = EmscriptenOptions & T & {
   then: unknown;
   HEAPU8: Uint8Array;
   mountFile(file: File): void;
};

export type EmscriptenFactory<T = {}> = (
   options: EmscriptenOptions
) => EmscriptenModule<T>;
