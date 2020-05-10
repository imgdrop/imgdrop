// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable no-underscore-dangle */

import * as wasm from '../../util/wasm';
import { decodeWebpImage } from './webp';

jest.mock('../../../wasm/webp/webp', () => 'webp js', { virtual: true });
jest.mock('../../../wasm/webp/webp.wasm', () => 'webp wasm', { virtual: true });

describe(decodeWebpImage, () => {
   let webpModuleMock: {
      HEAPU8: Uint8Array;
      _decodeWebpImage: jest.Mock;
      _getWebpWidth: jest.Mock;
      _getWebpHeight: jest.Mock;
   };
   let loadWasmSpy: jest.SpyInstance;

   beforeEach(() => {
      webpModuleMock = {
         HEAPU8: new Uint8Array([1, 2, 3, 4, 5, 9, 8, 7, 6]),
         _decodeWebpImage: jest.fn(),
         _getWebpWidth: jest.fn(),
         _getWebpHeight: jest.fn(),
      };
      webpModuleMock._decodeWebpImage.mockReturnValue(1);
      webpModuleMock._getWebpWidth.mockReturnValue(1);
      webpModuleMock._getWebpHeight.mockReturnValue(2);
      loadWasmSpy = jest.spyOn(wasm, 'loadWasmModule');
      loadWasmSpy.mockResolvedValue(webpModuleMock);
   });

   it('decodes an image to RGBA', async () => {
      await expect(decodeWebpImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([2, 3, 4, 5, 9, 8, 7, 6]),
         width: 1,
         height: 2,
      });

      expect(loadWasmSpy).toHaveBeenCalledWith('webp js', 'webp wasm', 'file');
      expect(webpModuleMock._decodeWebpImage).toHaveBeenCalledWith();
      expect(webpModuleMock._getWebpWidth).toHaveBeenCalledWith();
      expect(webpModuleMock._getWebpHeight).toHaveBeenCalledWith();
   });

   it('creates a new buffer instead of returning the wasm memory', async () => {
      const result = await decodeWebpImage('file' as any);
      expect(result.data.buffer).not.toBe(webpModuleMock.HEAPU8.buffer);
   });
});
