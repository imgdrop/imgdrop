import { ValueCache } from '../util/value-cache';
import * as context from './context';
import { ShaderCache } from './shader-cache';

jest.mock('./vertex.glsl', () => ({
   sourceCode: 'vertex(code)',
}));

afterEach(() => {
   ValueCache.clearCached();
});

describe(ShaderCache, () => {
   let glMock: {
      createShader: jest.Mock;
      shaderSource: jest.Mock;
      compileShader: jest.Mock;
      getShaderInfoLog: jest.Mock;
      getShaderParameter: jest.Mock;
      createProgram: jest.Mock;
      attachShader: jest.Mock;
      linkProgram: jest.Mock;
      detachShader: jest.Mock;
      deleteShader: jest.Mock;
      getProgramInfoLog: jest.Mock;
      getProgramParameter: jest.Mock;
      viewport: jest.Mock;
      useProgram: jest.Mock;
      activeTexture: jest.Mock;
      getUniformLocation: jest.Mock;
      uniform1i: jest.Mock;
      texImage2D: jest.Mock;
      drawArrays: jest.Mock;
      getError: jest.Mock;
      COMPILE_STATUS: string;
      VERTEX_SHADER: string;
      FRAGMENT_SHADER: string;
      LINK_STATUS: string;
      TEXTURE0: number;
      TEXTURE_2D: string;
      UNSIGNED_BYTE: string;
      LUMINANCE: string;
      TRIANGLES: string;
      NO_ERROR: string;
      canvas: {
         width?: number;
         height?: number;
      }
   };
   let getContextSpy: jest.SpyInstance;
   let shaderMetaMock: {
      sourceCode: string;
      uniforms: {
         uniform: {
            variableName: string;
         }
      }
   };
   let shaderCache: ShaderCache;

   beforeEach(() => {
      glMock = {
         createShader: jest.fn(),
         shaderSource: jest.fn(),
         compileShader: jest.fn(),
         getShaderInfoLog: jest.fn(),
         getShaderParameter: jest.fn(),
         createProgram: jest.fn(),
         attachShader: jest.fn(),
         linkProgram: jest.fn(),
         detachShader: jest.fn(),
         deleteShader: jest.fn(),
         getProgramInfoLog: jest.fn(),
         getProgramParameter: jest.fn(),
         viewport: jest.fn(),
         useProgram: jest.fn(),
         activeTexture: jest.fn(),
         getUniformLocation: jest.fn(),
         uniform1i: jest.fn(),
         texImage2D: jest.fn(),
         drawArrays: jest.fn(),
         getError: jest.fn(),
         COMPILE_STATUS: 'compile status',
         VERTEX_SHADER: 'vertex shader',
         FRAGMENT_SHADER: 'fragment shader',
         LINK_STATUS: 'link status',
         TEXTURE0: 10,
         TEXTURE_2D: 'texture 2D',
         UNSIGNED_BYTE: 'unsigned byte',
         LUMINANCE: 'luminance',
         TRIANGLES: 'triangles',
         NO_ERROR: 'no error',
         canvas: {}
      };
      glMock.createShader.mockReturnValueOnce('vertex object');
      glMock.createShader.mockReturnValue('fragment object');
      glMock.getShaderInfoLog.mockReturnValue(null);
      glMock.getShaderParameter.mockReturnValue(true);
      glMock.createProgram.mockReturnValue('program object');
      glMock.getProgramInfoLog.mockReturnValue(null);
      glMock.getProgramParameter.mockReturnValue(true);
      window.WebGLRenderingContext = glMock as any;
      getContextSpy = jest.spyOn(context, 'getColorContext');
      getContextSpy.mockReturnValue(glMock);

      shaderMetaMock = {
         sourceCode: 'fragment(code)',
         uniforms: {
            uniform: {
               variableName: 'var'
            }
         }
      }
      shaderCache = new ShaderCache(shaderMetaMock);
   });

   afterEach(() => {
      delete window.WebGLRenderingContext;
   });

   it('gets the color context', () => {
      expect(shaderCache.value).toBe('program object');
      expect(getContextSpy).toHaveBeenCalledWith();
   });

   describe('vertex shader', () => {
      it('creates a default vertex shader', () => {
         expect(shaderCache.value).toBe('program object');
         expect(glMock.createShader).toHaveBeenCalledWith('vertex shader');
         expect(glMock.shaderSource).toHaveBeenCalledWith(
            'vertex object',
            'vertex(code)'
         );
         expect(glMock.getShaderInfoLog).toHaveBeenCalledWith('vertex object');
         expect(glMock.getShaderParameter).toHaveBeenCalledWith(
            'vertex object',
            'compile status'
         );
      });

      it('throws an error if it fails to create a vertex shader', () => {
         glMock.createShader.mockReset();
         glMock.createShader.mockReturnValue(null);
         expect(() => shaderCache.value).toThrow(expect.any(Error));
         expect(glMock.shaderSource).not.toHaveBeenCalledWith(
            expect.any(String),
            'vertex(code)'
         );
      });

      it('throws an error if it fails to compile a vertex shader', () => {
         glMock.getShaderParameter.mockReturnValue(false);
         expect(() => shaderCache.value).toThrow(expect.any(Error));
      });

      it('reuses the same vertex object instance', () => {
         expect(shaderCache.value).toBe('program object');
         glMock.attachShader.mockClear();
         expect(new ShaderCache(shaderMetaMock).value).toBe('program object');
         expect(glMock.attachShader).toHaveBeenCalledWith(
            'program object',
            'vertex object'
         );
         expect(glMock.createShader).toHaveBeenCalledTimes(3);
      });
   });

   describe('fragment shader', () => {
      beforeEach(() => {
         glMock.getShaderInfoLog.mockReturnValue('shader log');
      });

      it('creates a fragment shader from the code', () => {
         expect(shaderCache.value).toBe('program object');
         expect(glMock.createShader).toHaveBeenCalledWith('fragment shader');
         expect(glMock.shaderSource).toHaveBeenCalledWith(
            'fragment object',
            'fragment(code)'
         );
         expect(glMock.getShaderInfoLog).toHaveBeenCalledWith('fragment object');
         expect(glMock.getShaderParameter).toHaveBeenCalledWith(
            'fragment object',
            'compile status'
         );
      });

      it('throws an error if it fails to create a fragment shader', () => {
         glMock.createShader.mockReturnValue(null);
         expect(() => shaderCache.value).toThrow(expect.any(Error));
         expect(glMock.shaderSource).not.toHaveBeenCalledWith(
            expect.any(String),
            'fragment(code)'
         );
      });

      it('throws an error if it fails to compile a fragment shader', () => {
         glMock.getShaderParameter.mockReturnValueOnce(true);
         glMock.getShaderParameter.mockReturnValue(false);
         expect(() => shaderCache.value).toThrow(expect.any(Error));
      });
   });

   describe('program', () => {
      it('links together the shaders in a program', () => {
         expect(shaderCache.value).toBe('program object');
         expect(glMock.createProgram).toHaveBeenCalledWith();
         expect(glMock.attachShader).toHaveBeenCalledWith(
            'program object',
            'vertex object'
         );
         expect(glMock.attachShader).toHaveBeenCalledWith(
            'program object',
            'fragment object'
         );
         expect(glMock.linkProgram).toHaveBeenCalledWith('program object');
         expect(glMock.detachShader).toHaveBeenCalledWith(
            'program object',
            'fragment object'
         );
         expect(glMock.deleteShader).toHaveBeenCalledWith('fragment object');
         expect(glMock.getProgramInfoLog).toHaveBeenCalledWith('program object');
         expect(glMock.getProgramParameter).toHaveBeenCalledWith(
            'program object',
            'link status'
         );
      });

      it('throws an error if it fails to create the program', () => {
         glMock.createProgram.mockReturnValue(null);
         expect(() => shaderCache.value).toThrow(expect.any(Error));
         expect(glMock.attachShader).not.toHaveBeenCalled();
      });

      it('throws an error if it fails to link the program', () => {
         glMock.getProgramInfoLog.mockReturnValue('program log');
         glMock.getProgramParameter.mockReturnValue(false);
         expect(() => shaderCache.value).toThrow(expect.any(Error));
      });
   });

   describe('begin', () => {
      it('begins the shader pass', () => {
         shaderCache.begin(100, 200);
         expect(glMock.canvas.width).toBe(100);
         expect(glMock.canvas.height).toBe(200);
         expect(glMock.viewport).toHaveBeenCalledWith(0, 0, 100, 200);
         expect(glMock.useProgram).toHaveBeenCalledWith('program object');
      });

      it('resets the current active texture', () => {
         shaderCache['activeTexture'] = 3;
         shaderCache.begin(100, 200);
         expect(shaderCache['activeTexture']).toBe(0);
      });
   });

   describe('uploadTexture', () => {
      beforeEach(() => {
         glMock.getUniformLocation.mockReturnValue('location');
      });

      it('uploads the data to the current active texture', () => {
         shaderCache['activeTexture'] = 1;
         shaderCache.uploadTexture('uniform', 'format' as any, new Uint8Array([1, 2, 3, 4, 5]), {
            offset: 1,
            width: 100,
            height: 200
         });

         expect(glMock.activeTexture).toHaveBeenCalledWith(11);
         expect(glMock.getUniformLocation).toHaveBeenCalledWith('program object', 'var');
         expect(glMock.uniform1i).toHaveBeenCalledWith('location', 1);
         expect(glMock.texImage2D).toHaveBeenCalledWith('texture 2D', 0, 'format', 100, 200, 0, 'format', 'unsigned byte', new Uint8Array([2, 3, 4, 5]));
      });

      it('increments the current active texture', () => {
         shaderCache['activeTexture'] = 1;
         shaderCache.uploadTexture('uniform', 'format' as any, new Uint8Array([1, 2, 3, 4, 5]), {
            offset: 0,
            width: 100,
            height: 200
         });
         expect(shaderCache['activeTexture']).toBe(2);
      });
   });

   describe('uploadOptionalTexture', () => {
      beforeEach(() => {
         glMock.getUniformLocation.mockReturnValue('location');
      });

      it('uploads the data when the plane is defined', () => {
         shaderCache.uploadOptionalTexture('uniform', 'format' as any, new Uint8Array([1, 2, 3, 4, 5]), {
            offset: 1,
            width: 100,
            height: 200
         });

         expect(glMock.activeTexture).toHaveBeenCalledWith(10);
         expect(glMock.getUniformLocation).toHaveBeenCalledWith('program object', 'var');
         expect(glMock.uniform1i).toHaveBeenCalledWith('location', 0);
         expect(glMock.texImage2D).toHaveBeenCalledWith('texture 2D', 0, 'format', 100, 200, 0, 'format', 'unsigned byte', new Uint8Array([2, 3, 4, 5]));
      });

      it('uploads a blank image when the plane is not defined', () => {
         shaderCache.uploadOptionalTexture('uniform', 'format' as any, new Uint8Array([1, 2, 3, 4, 5]), undefined);

         expect(glMock.activeTexture).toHaveBeenCalledWith(10);
         expect(glMock.getUniformLocation).toHaveBeenCalledWith('program object', 'var');
         expect(glMock.uniform1i).toHaveBeenCalledWith('location', 0);
         expect(glMock.texImage2D).toHaveBeenCalledWith('texture 2D', 0, 'luminance', 1, 1, 0, 'luminance', 'unsigned byte', new Uint8Array([0xFF]));
      });
   });

   describe('end', () => {
      it('finishes the shader pass and returns the canvas', () => {
         glMock.getError.mockReturnValue('no error');
         expect(shaderCache.end()).toBe(glMock.canvas);
         expect(glMock.drawArrays).toHaveBeenCalledWith('triangles', 0, 6);
         expect(glMock.getError).toHaveBeenCalledWith();
      });

      it('resets the current active texture', () => {
         glMock.getError.mockReturnValue('no error');
         shaderCache['activeTexture'] = 3;
         shaderCache.end();
         expect(shaderCache['activeTexture']).toBe(0);
      });

      it('throws an error if there was a WebGL error', () => {
         glMock.getError.mockReturnValue('error');
         expect(() => shaderCache.end()).toThrow(expect.any(Error));
      });
   });
});
