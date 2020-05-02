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
   HEAP8: Int8Array;
   HEAPU8: Uint8Array;
   HEAP16: Int16Array;
   HEAPU16: Uint16Array;
   HEAP32: Int32Array;
   HEAPU32: Uint32Array;
   HEAPF32: Float32Array;
   HEAPF64: Float64Array;

   then: unknown;
   mountFile(file: File): void;
};

export type EmscriptenFactory<T = {}> = (
   options: EmscriptenOptions
) => EmscriptenModule<T>;
