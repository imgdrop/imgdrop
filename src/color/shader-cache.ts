import { ValueCache } from '../util/value-cache';
import { getColorContext } from './context';
import { ColorPlane } from './types';
import vertexCode from './vertex.glsl';

function compileShader(type: number, code: string): WebGLShader {
   const gl = getColorContext();
   const shader = gl.createShader(type);
   if (shader === null) {
      throw new Error('Failed to create shader');
   }

   gl.shaderSource(shader, code);
   gl.compileShader(shader);
   const log = gl.getShaderInfoLog(shader);
   if (log !== null && log.length > 0) {
      console.warn(log);
   }
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Failed to compile shader');
   }
   return shader;
}

const vertexShader = new ValueCache(() =>
   compileShader(WebGLRenderingContext.VERTEX_SHADER, vertexCode.sourceCode)
);

export class ShaderCache extends ValueCache<WebGLProgram> {
   private activeTexture = 0;

   constructor(
      private readonly shaderMeta: {
         sourceCode: string;
         uniforms: {
            [key: string]: {
               variableName: string;
            };
         };
      }
   ) {
      super(() => {
         const gl = getColorContext();
         const program = gl.createProgram();
         if (program === null) {
            throw new Error('Failed to create program');
         }

         gl.attachShader(program, vertexShader.value);
         const fragShader = compileShader(gl.FRAGMENT_SHADER, shaderMeta.sourceCode);
         gl.attachShader(program, fragShader);
         gl.linkProgram(program);
         gl.detachShader(program, fragShader);
         gl.deleteShader(fragShader);
         const log = gl.getProgramInfoLog(program);
         if (log !== null && log.length > 0) {
            console.warn(log);
         }
         if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link program');
         }
         return program;
      });
   }

   begin(width: number, height: number): void {
      const gl = getColorContext();
      gl.canvas.width = width;
      gl.canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.useProgram(this.value);
      this.activeTexture = 0;
   }

   uploadTexture(
      name: string,
      format: number,
      data: Uint8Array,
      plane: ColorPlane
   ): void {
      const gl = getColorContext();
      gl.activeTexture(gl.TEXTURE0 + this.activeTexture);
      const location = gl.getUniformLocation(
         this.value,
         this.shaderMeta.uniforms[name].variableName
      );
      gl.uniform1i(location, this.activeTexture);
      gl.texImage2D(
         gl.TEXTURE_2D,
         0,
         format,
         plane.width,
         plane.height,
         0,
         format,
         gl.UNSIGNED_BYTE,
         data.subarray(plane.offset)
      );
      this.activeTexture += 1;
   }

   end(): HTMLCanvasElement {
      const gl = getColorContext();
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      const error = gl.getError();
      if (error !== gl.NO_ERROR) {
         throw new Error(`WebGL error: ${error}`);
      }
      this.activeTexture = 0;
      return gl.canvas as HTMLCanvasElement;
   }
}
