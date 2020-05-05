import * as wasm from '../../util/wasm';
import { decodeRawImage } from './raw';

jest.mock('../../../wasm/raw/raw', () => 'raw js', { virtual: true });
jest.mock('../../../wasm/raw/raw.wasm', () => 'raw wasm', { virtual: true });

/* eslint-disable no-underscore-dangle */

describe(decodeRawImage, () => {
   let rawModuleMock: {
      output: string;
      _decodeRawImage: jest.Mock;
      _getRawWidth: jest.Mock;
      _getRawHeight: jest.Mock;
   };
   let loadWasmSpy: jest.SpyInstance;

   beforeEach(() => {
      rawModuleMock = {
         output: 'output',
         _decodeRawImage: jest.fn(),
         _getRawWidth: jest.fn(),
         _getRawHeight: jest.fn(),
      };
      rawModuleMock._getRawWidth.mockReturnValue(100);
      rawModuleMock._getRawHeight.mockReturnValue(200);
      loadWasmSpy = jest.spyOn(wasm, 'loadWasmModule');
      loadWasmSpy.mockResolvedValue(rawModuleMock);
   });

   it('decodes an image to sRGB', async () => {
      await expect(decodeRawImage('file' as any)).resolves.toEqual({
         data: 'output',
         width: 100,
         height: 200,
      });

      expect(loadWasmSpy).toHaveBeenCalledWith('raw js', 'raw wasm', 'file');
      expect(rawModuleMock._decodeRawImage).toHaveBeenCalledWith();
      expect(rawModuleMock._getRawWidth).toHaveBeenCalledWith();
      expect(rawModuleMock._getRawHeight).toHaveBeenCalledWith();
   });
});
