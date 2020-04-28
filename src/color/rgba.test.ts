import { uploadRGBA } from './rgba';
import * as context from './context';

jest.mock('./rgba.glsl', () => ({
   sourceCode: 'rgba(code)',
   uniforms: {
      rgba: 'rgba uniform'
   }
}));

jest.mock('./shader-cache', () => ({
   ShaderCache: class {
      // eslint-disable-next-line class-methods-use-this
      use(): string {
         return 'program';
      }
   }
}));

describe(uploadRGBA, () => {
   let glMock: {
      texImage2D: jest.Mock;
      TEXTURE_2D: string;
      RGBA: string;
      UNSIGNED_BYTE: string;
      canvas: string;
   };
   let getContextSpy: jest.SpyInstance;
   let useTextureSpy: jest.SpyInstance;
   let runShaderSpy: jest.SpyInstance;

   beforeEach(() => {
      glMock = {
         texImage2D: jest.fn(),
         TEXTURE_2D: 'texture 2D',
         RGBA: 'RGBA',
         UNSIGNED_BYTE: 'unsigned byte',
         canvas: 'canvas'
      };
      getContextSpy = jest.spyOn(context, 'getColorContext');
      getContextSpy.mockReturnValue(glMock);
      useTextureSpy = jest.spyOn(context, 'useTexture');
      useTextureSpy.mockReturnValue(undefined);
      runShaderSpy = jest.spyOn(context, 'runShaderPass');
      runShaderSpy.mockReturnValue(undefined);
   });

   it('uploads the RGBA data to WebGL and returns the canvas', () => {
      expect(uploadRGBA('data' as any, 100, 200)).toBe('canvas');
      expect(getContextSpy).toHaveBeenCalledWith(100, 200);
      expect(useTextureSpy).toHaveBeenCalledWith('program', 'rgba uniform', 0);
      expect(glMock.texImage2D).toHaveBeenCalledWith('texture 2D', 0, 'RGBA', 100, 200, 0, 'RGBA', 'unsigned byte', 'data');
      expect(runShaderSpy).toHaveBeenCalledWith();
   });
});
