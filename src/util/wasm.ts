import { EmscriptenFactory, EmscriptenModule, EmscriptenOptions } from '../../wasm/types';
import { ValueCache } from './value-cache';

const wasmMemory = new ValueCache(() => new WebAssembly.Memory({ initial: 256 }));

function loadEmscriptenModule<T>(
   factory: EmscriptenFactory<T>,
   options: EmscriptenOptions
): Promise<EmscriptenModule<T>> {
   return new Promise((resolve) => {
      const module = factory({
         ...options,
         onRuntimeInitialized: () => {
            delete module.then;
            resolve(module);
         },
      });
   });
}

export async function loadWasmModule<T>(
   factory: EmscriptenFactory<T>,
   wasmPath: string,
   inputFile: File
): Promise<EmscriptenModule<T>> {
   const module = await loadEmscriptenModule(factory, {
      memory: wasmMemory.value,
      locateFile(path, prefix) {
         if (path.endsWith('.wasm')) {
            return wasmPath;
         }
         return `${prefix}${path}`;
      },
   });

   module.FS.mkdir('/wfs');
   module.FS.mount(
      module.FS.filesystems.WORKERFS,
      {
         blobs: [
            {
               name: 'input',
               data: inputFile,
            },
         ],
      },
      '/wfs'
   );

   return module;
}
