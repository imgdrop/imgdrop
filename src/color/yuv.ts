import { ShaderCache } from './shader-cache';
import { ColorPlane } from './types';
import yuvPlanarMeta from './yuv-planar.glsl';

const yuvPlanarShader = new ShaderCache(yuvPlanarMeta);

export function uploadPlanarYUV(
   data: Uint8Array,
   y: ColorPlane,
   cb: ColorPlane,
   cr: ColorPlane,
   alpha?: ColorPlane
): HTMLCanvasElement {
   yuvPlanarShader.begin(y.width, y.height);
   yuvPlanarShader.uploadTexture('y', WebGLRenderingContext.LUMINANCE, data, y);
   yuvPlanarShader.uploadTexture('cb', WebGLRenderingContext.LUMINANCE, data, cb);
   yuvPlanarShader.uploadTexture('cr', WebGLRenderingContext.LUMINANCE, data, cr);
   yuvPlanarShader.uploadOptionalTexture(
      'alpha',
      WebGLRenderingContext.LUMINANCE,
      data,
      alpha
   );
   return yuvPlanarShader.end();
}
