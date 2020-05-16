// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

declare module '*.wasm' {
   const wasm: string;
   export default wasm;
}

declare module '*.glsl' {
   const glsl: {
      sourceCode: string;
      uniforms: {
         [key: string]: {
            variableName: string;
         };
      };
   };
   export default glsl;
}

declare class FileReaderSync {
   readAsArrayBuffer(blob: Blob): ArrayBuffer;
}
