// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createContext } from '../util/util';

function loadHTMLImage(url: string): Promise<HTMLImageElement> {
   return new Promise((resolve, reject) => {
      const image = document.createElement('img');
      image.onload = (): void => resolve(image);
      image.onerror = (): void => reject(new Error('Failed to load image'));
      image.src = url;
   });
}

export async function decodeHTMLImage(file: File): Promise<HTMLCanvasElement> {
   const url = URL.createObjectURL(file);
   let image: HTMLImageElement;
   try {
      image = await loadHTMLImage(url);
   } finally {
      URL.revokeObjectURL(url);
   }

   const ctx = createContext(image.width, image.height, '2d');
   ctx.drawImage(image, 0, 0);
   return ctx.canvas;
}
