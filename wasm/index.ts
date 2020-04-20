import { readFile, createImageData } from '../src/util';

export interface EmscriptenOptions {
   locateFile?: (path: string, prefix: string) => string;
   onRuntimeInitialized?: () => void;
}

export interface EmscriptenModule extends EmscriptenOptions {
   HEAPU8: Uint8Array;
   _malloc(size: number): number;
   _imageDecode(data: number, dataSize: number): number;
   _imageWidth(): number;
   _imageHeight(): number;
}

export type EmscriptenFactory = (options: EmscriptenOptions) => EmscriptenModule;

export async function decodeWithWasm(file: File, factory: EmscriptenFactory, wasm: string): Promise<ImageData> {
   const module = factory({
      locateFile(path, prefix) {
         if (path.endsWith('.wasm')) {
            return wasm;
         } else {
            return `${prefix}${path}`;
         }
      }
   });

   await new Promise(resolve => module.onRuntimeInitialized = resolve);
   const data = await readFile(file);
   const dataPtr = module._malloc(data.byteLength);
   module.HEAPU8.set(new Uint8Array(data), dataPtr);
   const imagePtr = module._imageDecode(dataPtr, data.byteLength);
   const width = module._imageWidth();
   const height = module._imageHeight();
   const image = createImageData(width, height);
   image.data.set(module.HEAPU8.subarray(imagePtr, imagePtr + width * height * 4));
   return image;
}
