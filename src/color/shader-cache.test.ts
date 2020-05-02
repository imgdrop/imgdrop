import { ValueCache } from '../util/value-cache';
import * as context from './context';
import { ShaderCache } from './shader-cache';

jest.mock('./vertex.glsl', () => ({
   sourceCode: 'vertex(code)',
}));

afterEach(() => {
   ValueCache.clearCached();
});

describe.skip(ShaderCache, () => {
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
      useProgram: jest.Mock;
      COMPILE_STATUS: string;
      VERTEX_SHADER: string;
      FRAGMENT_SHADER: string;
      LINK_STATUS: string;
   };
   let getContextSpy: jest.SpyInstance;
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
         useProgram: jest.fn(),
         COMPILE_STATUS: 'compile status',
         VERTEX_SHADER: 'vertex shader',
         FRAGMENT_SHADER: 'fragment shader',
         LINK_STATUS: 'link status',
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
      // shaderCache = new ShaderCache('fragment(code)');
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
         // expect(new ShaderCache('other(code)').value).toBe('program object');
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

   describe('use', () => {
      it('uses the program and returns it', () => {
         // expect(shaderCache.use()).toBe('program object');
         expect(glMock.useProgram).toHaveBeenCalledWith('program object');
      });
   });
});
