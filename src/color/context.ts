import { createContext } from '../util/util';
import { ValueCache } from '../util/value-cache';

const webglContext = new ValueCache(() => {
   const gl = createContext(1, 1, 'webgl');
   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
   // prettier-ignore
   gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
   ]), gl.STATIC_DRAW);
   gl.enableVertexAttribArray(0);
   gl.vertexAttribPointer(0, 2, gl.UNSIGNED_BYTE, false, 0, 0);

   for (let i = 0; i < 4; i += 1) {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   }
   gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   return gl;
});

export function getColorContext(): WebGLRenderingContext {
   return webglContext.value;
}
