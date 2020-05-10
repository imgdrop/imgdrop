// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ValueCache } from '../util/value-cache';
import { getColorContext } from './context';

let canvasMock: {
   getContext: jest.Mock;
   width?: number;
   height?: number;
};
let glMock: {
   createBuffer: jest.Mock;
   bindBuffer: jest.Mock;
   bufferData: jest.Mock;
   enableVertexAttribArray: jest.Mock;
   vertexAttribPointer: jest.Mock;
   activeTexture: jest.Mock;
   createTexture: jest.Mock;
   bindTexture: jest.Mock;
   texParameteri: jest.Mock;
   pixelStorei: jest.Mock;
   viewport: jest.Mock;
   getUniformLocation: jest.Mock;
   uniform1i: jest.Mock;
   drawArrays: jest.Mock;
   getError: jest.Mock;
   ARRAY_BUFFER: string;
   STATIC_DRAW: string;
   UNSIGNED_BYTE: string;
   TEXTURE0: number;
   TEXTURE_2D: string;
   TEXTURE_MIN_FILTER: string;
   TEXTURE_MAG_FILTER: string;
   TEXTURE_WRAP_S: string;
   TEXTURE_WRAP_T: string;
   LINEAR: string;
   CLAMP_TO_EDGE: string;
   UNPACK_ALIGNMENT: string;
   UNPACK_FLIP_Y_WEBGL: string;
   TRIANGLES: string;
   NO_ERROR: string;
   canvas: typeof canvasMock;
};
let createElementSpy: jest.SpyInstance;

beforeEach(() => {
   canvasMock = {
      getContext: jest.fn(),
   };
   glMock = {
      createBuffer: jest.fn(),
      bindBuffer: jest.fn(),
      bufferData: jest.fn(),
      enableVertexAttribArray: jest.fn(),
      vertexAttribPointer: jest.fn(),
      activeTexture: jest.fn(),
      createTexture: jest.fn(),
      bindTexture: jest.fn(),
      texParameteri: jest.fn(),
      pixelStorei: jest.fn(),
      viewport: jest.fn(),
      getUniformLocation: jest.fn(),
      uniform1i: jest.fn(),
      drawArrays: jest.fn(),
      getError: jest.fn(),
      ARRAY_BUFFER: 'array buffer',
      STATIC_DRAW: 'static draw',
      UNSIGNED_BYTE: 'unsigned byte',
      TEXTURE0: 10,
      TEXTURE_2D: 'texture 2D',
      TEXTURE_MIN_FILTER: 'texture min filter',
      TEXTURE_MAG_FILTER: 'texture mag filter',
      TEXTURE_WRAP_S: 'texture wrap S',
      TEXTURE_WRAP_T: 'texture wrap T',
      LINEAR: 'linear',
      CLAMP_TO_EDGE: 'clamp to edge',
      UNPACK_ALIGNMENT: 'unpack alignment',
      UNPACK_FLIP_Y_WEBGL: 'unpack flip-Y WebGL',
      TRIANGLES: 'triangles',
      NO_ERROR: 'no error',
      canvas: canvasMock,
   };
   canvasMock.getContext.mockReturnValue(glMock);
   createElementSpy = jest.spyOn(document, 'createElement');
   createElementSpy.mockReturnValue(canvasMock);
});

afterEach(() => {
   ValueCache.clearCached();
});

describe(getColorContext, () => {
   it('creates a WebGL context on first run', () => {
      glMock.createBuffer.mockReturnValue('buffer');
      expect(getColorContext()).toBe(glMock);
      expect(glMock.createBuffer).toHaveBeenCalledWith();
      expect(glMock.bindBuffer).toHaveBeenCalledWith('array buffer', 'buffer');
      // prettier-ignore
      expect(glMock.bufferData).toHaveBeenCalledWith('array buffer', new Uint8Array([
         0, 0,
         1, 0,
         0, 1,
         0, 1,
         1, 0,
         1, 1,
      ]), 'static draw');
      expect(glMock.enableVertexAttribArray).toHaveBeenCalledWith(0);
      expect(glMock.vertexAttribPointer).toHaveBeenCalledWith(
         0,
         2,
         'unsigned byte',
         false,
         0,
         0
      );
      expect(glMock.pixelStorei).toHaveBeenCalledWith('unpack alignment', 1);
      expect(glMock.pixelStorei).toHaveBeenCalledWith('unpack flip-Y WebGL', true);
      expect(canvasMock.width).toBe(1);
      expect(canvasMock.height).toBe(1);
   });

   it('creates 4 textures', () => {
      glMock.createTexture.mockReturnValueOnce('texture 0');
      glMock.createTexture.mockReturnValueOnce('texture 1');
      glMock.createTexture.mockReturnValueOnce('texture 2');
      glMock.createTexture.mockReturnValueOnce('texture 3');
      getColorContext();
      expect(glMock.createTexture).toHaveBeenCalledWith();

      expect(glMock.activeTexture).toHaveBeenCalledWith(10);
      expect(glMock.bindTexture).toHaveBeenCalledWith('texture 2D', 'texture 0');
      expect(glMock.activeTexture).toHaveBeenCalledWith(11);
      expect(glMock.bindTexture).toHaveBeenCalledWith('texture 2D', 'texture 1');
      expect(glMock.activeTexture).toHaveBeenCalledWith(12);
      expect(glMock.bindTexture).toHaveBeenCalledWith('texture 2D', 'texture 2');
      expect(glMock.activeTexture).toHaveBeenCalledWith(13);
      expect(glMock.bindTexture).toHaveBeenCalledWith('texture 2D', 'texture 3');

      expect(glMock.texParameteri).toHaveBeenCalledWith(
         'texture 2D',
         'texture min filter',
         'linear'
      );
      expect(glMock.texParameteri).toHaveBeenCalledWith(
         'texture 2D',
         'texture mag filter',
         'linear'
      );
      expect(glMock.texParameteri).toHaveBeenCalledWith(
         'texture 2D',
         'texture wrap S',
         'clamp to edge'
      );
      expect(glMock.texParameteri).toHaveBeenCalledWith(
         'texture 2D',
         'texture wrap T',
         'clamp to edge'
      );

      expect(glMock.activeTexture).toHaveBeenCalledTimes(4);
      expect(glMock.createTexture).toHaveBeenCalledTimes(4);
      expect(glMock.bindTexture).toHaveBeenCalledTimes(4);
      expect(glMock.texParameteri).toHaveBeenCalledTimes(16);
   });

   it('caches the same WebGL context', () => {
      getColorContext();
      canvasMock.getContext.mockReturnValue('webgl');
      expect(getColorContext()).toBe(glMock);
      expect(glMock.createBuffer).toHaveBeenCalledTimes(1);
   });
});
