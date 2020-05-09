import * as wasm from '../../util/wasm';
import { decodeHeifImage } from './heif';

jest.mock('../../../wasm/heif/heif', () => 'heif js', { virtual: true });
jest.mock('../../../wasm/heif/heif.wasm', () => 'heif wasm', { virtual: true });

/* eslint-disable no-underscore-dangle */

describe.skip(decodeHeifImage, () => {
   let heifModuleMock: {
      HEAPU8: Uint8Array;
      _decodeHeifImage: jest.Mock;
      _getHeifWidth: jest.Mock;
      _getHeifHeight: jest.Mock;
   };
   let loadWasmSpy: jest.SpyInstance;

   beforeEach(() => {
      heifModuleMock = {
         HEAPU8: new Uint8Array([1, 2, 3, 4, 5, 9, 8, 7, 6]),
         _decodeHeifImage: jest.fn(),
         _getHeifWidth: jest.fn(),
         _getHeifHeight: jest.fn(),
      };
      heifModuleMock._decodeHeifImage.mockReturnValue(1);
      heifModuleMock._getHeifWidth.mockReturnValue(1);
      heifModuleMock._getHeifHeight.mockReturnValue(2);
      loadWasmSpy = jest.spyOn(wasm, 'loadWasmModule');
      loadWasmSpy.mockResolvedValue(heifModuleMock);
   });

   it('decodes an image to RGBA', async () => {
      await expect(decodeHeifImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([2, 3, 4, 5, 9, 8, 7, 6]),
         width: 1,
         height: 2,
      });

      expect(loadWasmSpy).toHaveBeenCalledWith('heif js', 'heif wasm', 'file');
      expect(heifModuleMock._decodeHeifImage).toHaveBeenCalledWith();
      expect(heifModuleMock._getHeifWidth).toHaveBeenCalledWith();
      expect(heifModuleMock._getHeifHeight).toHaveBeenCalledWith();
   });

   it('creates a new buffer instead of returning the wasm memory', async () => {
      const result = await decodeHeifImage('file' as any);
      expect(result.data.buffer).not.toBe(heifModuleMock.HEAPU8.buffer);
   });
});
