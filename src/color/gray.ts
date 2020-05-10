// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import grayPlanarMeta from './gray-planar.glsl';
import { ShaderCache } from './shader-cache';
import { ColorPlane } from './types';

const grayPlanarShader = new ShaderCache(grayPlanarMeta);

export function uploadPlanarGray(
   data: Uint8Array,
   gray: ColorPlane,
   alpha?: ColorPlane
): HTMLCanvasElement {
   grayPlanarShader.begin(gray.width, gray.height);
   grayPlanarShader.uploadTexture('gray', WebGLRenderingContext.LUMINANCE, data, gray);
   grayPlanarShader.uploadOptionalTexture(
      'alpha',
      WebGLRenderingContext.LUMINANCE,
      data,
      alpha
   );
   return grayPlanarShader.end();
}
