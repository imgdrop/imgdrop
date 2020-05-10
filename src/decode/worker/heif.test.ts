// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import * as wasm from '../../util/wasm';
import { decodeHeifImage } from './heif';

jest.mock('../../../wasm/heif/heif', () => 'heif js', { virtual: true });
jest.mock('../../../wasm/heif/heif.wasm', () => 'heif wasm', { virtual: true });

describe(decodeHeifImage, () => {
   let planeDataMock: number[];
   let heifModuleMock: {
      HEAPU8: Uint8Array;
      HEAPU16: Uint16Array;
      _decodeHeifImage: jest.Mock;
      _getHeifColorspace: jest.Mock;
      _getHeifChroma: jest.Mock;
      _getHeifData: jest.Mock;
      _getHeifStride: jest.Mock;
      _getHeifWidth: jest.Mock;
      _getHeifHeight: jest.Mock;
   };
   let loadWasmSpy: jest.SpyInstance;

   beforeEach(() => {
      planeDataMock = [0, 2, 4, 0, 2, 4, 0, 0, 0, 0, 2];
      const heap = new Uint16Array([1, 2, 3, 4, 5, 9, 8, 7, 6]).buffer;
      heifModuleMock = {
         HEAPU8: new Uint8Array(heap),
         HEAPU16: new Uint16Array(heap),
         _decodeHeifImage: jest.fn(),
         _getHeifColorspace: jest.fn(),
         _getHeifChroma: jest.fn(),
         _getHeifData: jest.fn(),
         _getHeifStride: jest.fn(),
         _getHeifWidth: jest.fn(),
         _getHeifHeight: jest.fn(),
      };
      heifModuleMock._getHeifData.mockImplementation((id) => planeDataMock[id]);
      heifModuleMock._getHeifStride.mockReturnValue(1);
      heifModuleMock._getHeifWidth.mockReturnValue(1);
      heifModuleMock._getHeifHeight.mockReturnValue(2);
      loadWasmSpy = jest.spyOn(wasm, 'loadWasmModule');
      loadWasmSpy.mockResolvedValue(heifModuleMock);
   });

   it('decodes a monochrome image', async () => {
      heifModuleMock._getHeifColorspace.mockReturnValue(2);
      heifModuleMock._getHeifChroma.mockReturnValue(0);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 0]),
         colorspace: 2,
         chroma: 0,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(loadWasmSpy).toHaveBeenCalledWith('heif js', 'heif wasm', 'file');
      expect(heifModuleMock._decodeHeifImage).toHaveBeenCalledWith();
      expect(heifModuleMock._getHeifColorspace).toHaveBeenCalledWith();
      expect(heifModuleMock._getHeifChroma).toHaveBeenCalledWith();
      expect(heifModuleMock._getHeifWidth).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifHeight).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifData).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a monochrome image with large stride', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(2);
      heifModuleMock._getHeifColorspace.mockReturnValue(2);
      heifModuleMock._getHeifChroma.mockReturnValue(0);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 2]),
         colorspace: 2,
         chroma: 0,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a YUV420 image', async () => {
      heifModuleMock._getHeifColorspace.mockReturnValue(0);
      heifModuleMock._getHeifChroma.mockReturnValue(1);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 0, 2, 0, 3, 0]),
         colorspace: 0,
         chroma: 1,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
            {
               offset: 2,
               width: 1,
               height: 2,
            },
            {
               offset: 4,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(1);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(2);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(3);
   });

   it('decodes a YUV422 image', async () => {
      heifModuleMock._getHeifColorspace.mockReturnValue(0);
      heifModuleMock._getHeifChroma.mockReturnValue(2);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 0, 2, 0, 3, 0]),
         colorspace: 0,
         chroma: 2,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
            {
               offset: 2,
               width: 1,
               height: 2,
            },
            {
               offset: 4,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(1);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(2);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(3);
   });

   it('decodes a YUV444 image', async () => {
      heifModuleMock._getHeifColorspace.mockReturnValue(0);
      heifModuleMock._getHeifChroma.mockReturnValue(3);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 0, 2, 0, 3, 0]),
         colorspace: 0,
         chroma: 3,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
            {
               offset: 2,
               width: 1,
               height: 2,
            },
            {
               offset: 4,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(0);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(1);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(2);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(3);
   });

   it('decodes a RGB planar image', async () => {
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(3);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 0, 2, 0, 3, 0]),
         colorspace: 1,
         chroma: 3,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
            {
               offset: 2,
               width: 1,
               height: 2,
            },
            {
               offset: 4,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(3);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(4);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(5);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(3);
   });

   it('decodes a RGBA planar image', async () => {
      planeDataMock[6] = 6;
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(3);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 0, 2, 0, 3, 0, 4, 0]),
         colorspace: 1,
         chroma: 3,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
            {
               offset: 2,
               width: 1,
               height: 2,
            },
            {
               offset: 4,
               width: 1,
               height: 2,
            },
            {
               offset: 6,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(3);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(4);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(5);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(6);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(4);
   });

   it('decodes a RGB image', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(4);
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(4);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([2, 0, 3, 4, 0, 5]),
         colorspace: 1,
         chroma: 4,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(10);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a RGBA image', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(4);
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(5);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([2, 0, 3, 0, 4, 0, 5, 0]),
         colorspace: 1,
         chroma: 5,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(10);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a RGB 16BE image', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(8);
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(6);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 2, 3, 8, 7, 6]),
         colorspace: 1,
         chroma: 6,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(10);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a RGBA 16BE image', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(8);
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(7);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 2, 3, 4, 8, 7, 6, 5]),
         colorspace: 1,
         chroma: 7,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(10);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a RGB 16LE image', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(8);
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(8);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([0, 0, 0, 0, 0, 0]),
         colorspace: 1,
         chroma: 8,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(10);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });

   it('decodes a RGBA 16LE image', async () => {
      heifModuleMock._getHeifStride.mockReturnValue(8);
      heifModuleMock._getHeifColorspace.mockReturnValue(1);
      heifModuleMock._getHeifChroma.mockReturnValue(9);
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
         colorspace: 1,
         chroma: 9,
         planes: [
            {
               offset: 0,
               width: 1,
               height: 2,
            },
         ],
      });

      expect(heifModuleMock._getHeifStride).toHaveBeenCalledWith(10);
      expect(heifModuleMock._getHeifStride).toHaveBeenCalledTimes(1);
   });
});
