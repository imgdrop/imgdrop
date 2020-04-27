import { createContext } from '../util/util';
import { ValueCache } from '../util/value-cache';

const webglContext = new ValueCache(() => {
   const gl = createContext(1, 1, 'webgl');
   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
   // prettier-ignore
   gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([
      -1, -1,
      +1, -1,
      -1, +1,
      +1, +1
   ]), gl.STATIC_DRAW);
   gl.enableVertexAttribArray(0);
   gl.vertexAttribPointer(0, 2, gl.BYTE, false, 0, 0);
   for (let i = 0; i < 4; i += 1) {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
   }
   return gl;
});

export function getColorContext(): WebGLRenderingContext;
export function getColorContext(width: number, height: number): WebGLRenderingContext;
export function getColorContext(width?: number, height?: number): WebGLRenderingContext {
   const gl = webglContext.value;
   if (width !== undefined && height !== undefined) {
      gl.canvas.width = width;
      gl.canvas.height = height;
   }
   return gl;
}
