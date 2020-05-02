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
   if (alpha === undefined) {
      rgbaPlanarShader.uploadTexture(
         'alpha',
         WebGLRenderingContext.LUMINANCE,
         new Uint8Array([0xff]),
         {
            offset: 0,
            width: 1,
            height: 1,
         }
      );
   } else {
      rgbaPlanarShader.uploadTexture(
         'alpha',
         WebGLRenderingContext.LUMINANCE,
         data,
         alpha
      );
   }
   return rgbaPlanarShader.end();
}
