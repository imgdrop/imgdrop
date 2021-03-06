// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

interface OptionsMap {
   '2d': CanvasRenderingContext2DSettings;
   webgl: WebGLContextAttributes;
}

interface ContextMap {
   '2d': CanvasRenderingContext2D;
   webgl: WebGLRenderingContext;
}

export function createContext<T extends keyof ContextMap>(
   width: number,
   height: number,
   type: T,
   options?: OptionsMap[T]
): ContextMap[T] {
   const canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;

   const context = canvas.getContext(type, options);
   if (context === null) {
      throw new Error(`Failed to create ${type.toUpperCase()} context`);
   }
   return context as ContextMap[T];
}

export function timeoutPromise(time = 0): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, time));
}
