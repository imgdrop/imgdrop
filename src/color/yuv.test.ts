import { shaderMocks } from './__mocks__/shader-cache-array';
import { uploadPlanarYUV } from './yuv';

jest.mock('./yuv-planar.glsl', () => 'YUV planar meta');
jest.mock('./shader-cache');

beforeEach(() => {
   window.WebGLRenderingContext = {
      LUMINANCE: 'luminance',
   } as any;
});

afterEach(() => {
   delete window.WebGLRenderingContext;
});

it('creates a YUV planar shader', () => {
   expect(shaderMocks[0].meta).toBe('YUV planar meta');
});

describe(uploadPlanarYUV, () => {
   it('uploads the YUV data to WebGL and returns the canvas', () => {
      shaderMocks[0].end.mockReturnValue('canvas');
      const yMock = {
         width: 100,
         height: 200,
      };
      expect(
         uploadPlanarYUV(
            'data' as any,
            yMock as any,
            'cb plane' as any,
            'cr plane' as any,
            'alpha plane' as any
         )
      ).toBe('canvas');
      expect(shaderMocks[0].begin).toHaveBeenCalledWith(100, 200);
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith(
         'y',
         'luminance',
         'data',
         yMock
      );
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith(
         'cb',
         'luminance',
         'data',
         'cb plane'
      );
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith(
         'cr',
         'luminance',
         'data',
         'cr plane'
      );
      expect(shaderMocks[0].uploadOptionalTexture).toHaveBeenCalledWith(
         'alpha',
         'luminance',
         'data',
         'alpha plane'
      );
      expect(shaderMocks[0].end).toHaveBeenCalledWith();
   });
});
