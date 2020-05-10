// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { shaderMocks } from './__mocks__/shader-cache-array';
import { uploadGrayAlpha, uploadPlanarRGBA, uploadRGB, uploadRGBA } from './rgba';

jest.mock('./rgba.glsl', () => 'rgba meta');
jest.mock('./rgba-planar.glsl', () => 'rgba planar meta');
jest.mock('./shader-cache');

beforeEach(() => {
   window.WebGLRenderingContext = {
      RGBA: 'RGBA',
      RGB: 'RGB',
      LUMINANCE: 'luminance',
      LUMINANCE_ALPHA: 'luminance alpha',
   } as any;
});

afterEach(() => {
   delete window.WebGLRenderingContext;
});

it('creates RGBA and planar RGBA shaders', () => {
   expect(shaderMocks[0].meta).toBe('rgba meta');
   expect(shaderMocks[1].meta).toBe('rgba planar meta');
});

describe(uploadRGBA, () => {
   it('uploads the RGBA data to WebGL and returns the canvas', () => {
      shaderMocks[0].end.mockReturnValue('canvas');
      expect(uploadRGBA('data' as any, 100, 200)).toBe('canvas');
      expect(shaderMocks[0].begin).toHaveBeenCalledWith(100, 200);
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith('rgba', 'RGBA', 'data', {
         offset: 0,
         width: 100,
         height: 200,
      });
      expect(shaderMocks[0].end).toHaveBeenCalledWith();
   });
});

describe(uploadPlanarRGBA, () => {
   it('uploads the RGBA planar data to WebGL and returns the canvas', () => {
      shaderMocks[1].end.mockReturnValue('canvas');
      const redMock = {
         width: 100,
         height: 200,
      };
      expect(
         uploadPlanarRGBA(
            'data' as any,
            redMock as any,
            'green' as any,
            'blue' as any,
            'alpha' as any
         )
      );
      expect(shaderMocks[1].begin).toHaveBeenCalledWith(100, 200);
      expect(shaderMocks[1].uploadTexture).toHaveBeenCalledWith(
         'red',
         'luminance',
         'data',
         redMock
      );
      expect(shaderMocks[1].uploadTexture).toHaveBeenCalledWith(
         'green',
         'luminance',
         'data',
         'green'
      );
      expect(shaderMocks[1].uploadTexture).toHaveBeenCalledWith(
         'blue',
         'luminance',
         'data',
         'blue'
      );
      expect(shaderMocks[1].uploadOptionalTexture).toHaveBeenCalledWith(
         'alpha',
         'luminance',
         'data',
         'alpha'
      );
   });
});

describe(uploadRGB, () => {
   it('uploads the RGBA data to WebGL and returns the canvas', () => {
      shaderMocks[0].end.mockReturnValue('canvas');
      expect(uploadRGB('data' as any, 100, 200)).toBe('canvas');
      expect(shaderMocks[0].begin).toHaveBeenCalledWith(100, 200);
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith('rgba', 'RGB', 'data', {
         offset: 0,
         width: 100,
         height: 200,
      });
      expect(shaderMocks[0].end).toHaveBeenCalledWith();
   });
});

describe(uploadGrayAlpha, () => {
   it('uploads the gray-alpha data to WebGL and returns the canvas', () => {
      shaderMocks[0].end.mockReturnValue('canvas');
      expect(uploadGrayAlpha('data' as any, 100, 200)).toBe('canvas');
      expect(shaderMocks[0].begin).toHaveBeenCalledWith(100, 200);
      expect(shaderMocks[0].uploadTexture).toHaveBeenCalledWith(
         'rgba',
         'luminance alpha',
         'data',
         {
            offset: 0,
            width: 100,
            height: 200,
         }
      );
      expect(shaderMocks[0].end).toHaveBeenCalledWith();
   });
});
