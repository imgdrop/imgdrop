import { getColorContext, runShaderPass, useTexture } from './context';
import rgbaCode from './rgba.glsl';
import { ShaderCache } from './shader-cache';

const rgbaShader = new ShaderCache(rgbaCode.sourceCode);

export async function uploadRGBA(
   data: Uint8Array,
   width: number,
   height: number
): Promise<HTMLCanvasElement> {
   const gl = getColorContext(width, height);
   const program = rgbaShader.use();
   useTexture(program, rgbaCode.uniforms.rgba, 0);
   gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data
   );
   await runShaderPass();
   return gl.canvas as HTMLCanvasElement;
}
