// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import rgbaPlanarMeta from './rgba-planar.glsl';
import rgbaMeta from './rgba.glsl';
import { ShaderCache } from './shader-cache';
import { ColorPlane } from './types';

const rgbaShader = new ShaderCache(rgbaMeta);
const rgbaPlanarShader = new ShaderCache(rgbaPlanarMeta);

export function uploadRGBA(
   data: Uint8Array,
   width: number,
   height: number
): HTMLCanvasElement {
   rgbaShader.begin(width, height);
   rgbaShader.uploadTexture('rgba', WebGLRenderingContext.RGBA, data, {
      offset: 0,
      width,
      height,
   });
   return rgbaShader.end();
}

export function uploadPlanarRGBA(
   data: Uint8Array,
   red: ColorPlane,
   green: ColorPlane,
   blue: ColorPlane,
   alpha?: ColorPlane
): HTMLCanvasElement {
   rgbaPlanarShader.begin(red.width, red.height);
   rgbaPlanarShader.uploadTexture('red', WebGLRenderingContext.LUMINANCE, data, red);
   rgbaPlanarShader.uploadTexture('green', WebGLRenderingContext.LUMINANCE, data, green);
   rgbaPlanarShader.uploadTexture('blue', WebGLRenderingContext.LUMINANCE, data, blue);
   rgbaPlanarShader.uploadOptionalTexture(
      'alpha',
      WebGLRenderingContext.LUMINANCE,
      data,
      alpha
   );
   return rgbaPlanarShader.end();
}

export function uploadRGB(
   data: Uint8Array,
   width: number,
   height: number
): HTMLCanvasElement {
   rgbaShader.begin(width, height);
   rgbaShader.uploadTexture('rgba', WebGLRenderingContext.RGB, data, {
      offset: 0,
      width,
      height,
   });
   return rgbaShader.end();
}

export function uploadGrayAlpha(
   data: Uint8Array,
   width: number,
   height: number
): HTMLCanvasElement {
   rgbaShader.begin(width, height);
   rgbaShader.uploadTexture('rgba', WebGLRenderingContext.LUMINANCE_ALPHA, data, {
      offset: 0,
      width,
      height,
   });
   return rgbaShader.end();
}
