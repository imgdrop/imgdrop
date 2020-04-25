/* eslint-disable import/no-default-export */

interface EmscriptenOptions {
   memory?: WebAssembly.Memory;
   locateFile?: (path: string, prefix: string) => string;
   initiateWasm?: (
      imports: WebAssembly.Imports,
      callback: (exports: WebAssembly.Exports) => void
   ) => WebAssembly.Exports | false;
   onRuntimeInitialized?: () => void;
}

interface EmscriptenModule extends EmscriptenOptions {
   then?: unknown;
   HEAPU8: Uint8Array;
   _malloc(size: number): number;
}

type EmscriptenFactory<T = {}> = (options: EmscriptenOptions) => EmscriptenOptions & T;

declare module '~wasm/webp' {
   const webp: EmscriptenFactory<{
      _decodeWebpImage(data: number, dataSize: number): number;
      _getWebpWidth(): number;
      _getWebpHeight(): number;
   }>;
   export default webp;
}

declare module '*.wasm' {
   const wasm: string;
   export default wasm;
}
