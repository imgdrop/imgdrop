// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import * as wasm from '../../util/wasm';
import { decodeJP2Image } from './jp2';

jest.mock('../../../wasm/jp2/jp2', () => 'jp2 js', { virtual: true });
jest.mock('../../../wasm/jp2/jp2.wasm', () => 'jp2 wasm', { virtual: true });

describe(decodeJP2Image, () => {
   let jp2ModuleMock: {
      HEAP32: Int32Array;
      _decodeJP2Image: jest.Mock;
      _getJP2Planes: jest.Mock;
      _getJP2Data: jest.Mock;
      _getJP2Width: jest.Mock;
      _getJP2Height: jest.Mock;
      _getJP2Bitdepth: jest.Mock;
   };
   let loadWasmSpy: jest.SpyInstance;

   beforeEach(() => {
      jp2ModuleMock = {
         HEAP32: new Int32Array([1, 2, 3, 4, 5]),
         _decodeJP2Image: jest.fn(),
         _getJP2Planes: jest.fn(),
         _getJP2Data: jest.fn(),
         _getJP2Width: jest.fn(),
         _getJP2Height: jest.fn(),
         _getJP2Bitdepth: jest.fn(),
      };
      jp2ModuleMock._getJP2Planes.mockReturnValue(4);
      jp2ModuleMock._getJP2Data.mockImplementation((index) => index * 4);
      jp2ModuleMock._getJP2Width.mockReturnValue(1);
      jp2ModuleMock._getJP2Height.mockReturnValue(2);
      jp2ModuleMock._getJP2Bitdepth.mockReturnValue(8);
      loadWasmSpy = jest.spyOn(wasm, 'loadWasmModule');
      loadWasmSpy.mockResolvedValue(jp2ModuleMock);
   });

   it('decodes an image using WebAssembly', async () => {
      jp2ModuleMock._decodeJP2Image.mockReturnValue('format');
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toEqual({
         data: expect.any(Uint8Array),
         format: 'format',
         planes: expect.any(Array),
      });
      expect(loadWasmSpy).toHaveBeenCalledWith('jp2 js', 'jp2 wasm', 'file');
      expect(jp2ModuleMock._decodeJP2Image).toHaveBeenCalledWith('codec');
      expect(jp2ModuleMock._getJP2Planes).toHaveBeenCalledWith();
   });

   it('constructs a byte array from the format properties', async () => {
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toMatchObject({
         data: new Uint8Array([1, 2, 2, 3, 3, 4, 4, 5]),
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

      expect(jp2ModuleMock._getJP2Width).toHaveBeenCalledWith(0);
      expect(jp2ModuleMock._getJP2Height).toHaveBeenCalledWith(0);
      expect(jp2ModuleMock._getJP2Data).toHaveBeenCalledWith(0);
      expect(jp2ModuleMock._getJP2Bitdepth).toHaveBeenCalledWith(0);

      expect(jp2ModuleMock._getJP2Width).toHaveBeenCalledWith(1);
      expect(jp2ModuleMock._getJP2Height).toHaveBeenCalledWith(1);
      expect(jp2ModuleMock._getJP2Data).toHaveBeenCalledWith(1);
      expect(jp2ModuleMock._getJP2Bitdepth).toHaveBeenCalledWith(1);

      expect(jp2ModuleMock._getJP2Width).toHaveBeenCalledWith(2);
      expect(jp2ModuleMock._getJP2Height).toHaveBeenCalledWith(2);
      expect(jp2ModuleMock._getJP2Data).toHaveBeenCalledWith(2);
      expect(jp2ModuleMock._getJP2Bitdepth).toHaveBeenCalledWith(2);

      expect(jp2ModuleMock._getJP2Width).toHaveBeenCalledWith(3);
      expect(jp2ModuleMock._getJP2Height).toHaveBeenCalledWith(3);
      expect(jp2ModuleMock._getJP2Data).toHaveBeenCalledWith(3);
      expect(jp2ModuleMock._getJP2Bitdepth).toHaveBeenCalledWith(3);

      expect(jp2ModuleMock._getJP2Width).toHaveBeenCalledTimes(4);
      expect(jp2ModuleMock._getJP2Height).toHaveBeenCalledTimes(4);
      expect(jp2ModuleMock._getJP2Data).toHaveBeenCalledTimes(4);
      expect(jp2ModuleMock._getJP2Bitdepth).toHaveBeenCalledTimes(4);
   });

   it('downsamples the output data if needed', async () => {
      jp2ModuleMock.HEAP32 = new Int32Array([0x0000, 0xffff, 0x7fff, 0xffff, 0x0000]);
      jp2ModuleMock._getJP2Bitdepth.mockReturnValue(16);
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toMatchObject({
         data: new Uint8Array([0x00, 0xff, 0xff, 0x7f, 0x7f, 0xff, 0xff, 0x00]),
      });
   });
});
