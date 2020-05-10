// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

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

   module.mountFile(inputFile);
   return module;
}
