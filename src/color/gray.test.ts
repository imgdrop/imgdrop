import { shaderMocks } from './__mocks__/shader-cache-array';
import { uploadPlanarGray } from './gray';

jest.mock('./gray-planar.glsl', () => 'gray planar meta');
jest.mock('./shader-cache');

beforeEach(() => {
   window.WebGLRenderingContext = {
      LUMINANCE: 'luminance',
   } as any;
});

afterEach(() => {
   delete window.WebGLRenderingContext;
});

it('creates a gray planar shader', () => {
   expect(shaderMocks[0].meta).toBe('gray planar meta');
});

describe(uploadPlanarGray, () => {
   it('uploads the gray data to WebGL and returns the canvas', () => {
      shaderMocks[0].end.mockReturnValue('canvas');
      const grayMock = {
         width: 100,
         height: 200,
      };
      expect(uploadPlanarGray('data' as any, grayMock as any, 'alpha plane' as any)).toBe(
         'canvas'
      );
      expect(shaderMocks[0].begin).toHaveBeenCalledWith(100, 200);
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith(
         'gray',
         'luminance',
         'data',
         grayMock
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
