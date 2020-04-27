import { ValueCache } from '../util/value-cache';
import { getColorContext } from './context';

function compileShader(type: number, code: string): WebGLShader {
   const gl = getColorContext();
   const shader = gl.createShader(type);
   if (shader === null) {
      throw new Error('Failed to create shader');
   }

   gl.shaderSource(shader, `#version 100\n${code}`);
   gl.compileShader(shader);
   const log = gl.getShaderInfoLog(shader);
   if (log !== null) {
      console.warn(log);
   }
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Failed to compile shader');
   }
   return shader;
}

const vertexShader = new ValueCache(() =>
   compileShader(
      WebGLRenderingContext.VERTEX_SHADER,
      '???' // TODO: use webpack-glsl-minify
   )
);

export class ShaderCache extends ValueCache<WebGLProgram> {
   constructor(code: string) {
      super(() => {
         const gl = getColorContext();
         const program = gl.createProgram();
         if (program === null) {
            throw new Error('Failed to create program');
         }

         gl.attachShader(program, vertexShader.value);
         const fragShader = compileShader(gl.FRAGMENT_SHADER, code);
         gl.attachShader(program, fragShader);
         gl.linkProgram(program);
         gl.detachShader(program, fragShader);
         gl.deleteShader(fragShader);
         const log = gl.getProgramInfoLog(program);
         if (log !== null) {
            console.warn(log);
         }
         if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link program');
         }
         return program;
      });
   }

   use(): WebGLProgram {
      const gl = getColorContext();
      const program = this.value;
      gl.useProgram(program);
      return program;
   }
}
