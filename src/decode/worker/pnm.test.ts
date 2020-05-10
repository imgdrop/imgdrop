// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as pnm from '@imgdrop/pnm';
import { decodePNMImage } from './pnm';

describe(decodePNMImage, () => {
   let decoderMock: {
      decode: jest.Mock;
      data?: Uint8Array | Uint16Array;
      width?: number;
      height?: number;
      depth?: number;
      tupltype?: string;
      maxval?: number;
   };
   let decoderSpy: jest.SpyInstance;

   beforeEach(() => {
      decoderMock = {
         decode: jest.fn(),
      };
      decoderSpy = jest.spyOn(pnm, 'PNMDecoder');
      decoderSpy.mockImplementation(function PNMDecoder() {
         return decoderMock;
      });
   });

   it('decodes an image using @imgdrop/pnm', async () => {
      decoderMock.data = new Uint8Array([1, 2, 3, 4, 5, 9, 8, 7]);
      decoderMock.width = 2;
      decoderMock.height = 2;
      decoderMock.depth = 2;
      decoderMock.maxval = 0xff;
      decoderMock.tupltype = 'tuple type';
      await expect(decodePNMImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([1, 2, 3, 4, 5, 9, 8, 7]),
         width: 2,
         height: 2,
         format: 'tuple type',
      });

      expect(decoderSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(decoderMock.decode).toHaveBeenCalledWith();
   });

   it('supports 16-bit color', async () => {
      decoderMock.data = new Uint16Array([0x0000, 0x7fff, 0xffff, 0x7fff]);
      decoderMock.width = 2;
      decoderMock.height = 2;
      decoderMock.depth = 1;
      decoderMock.maxval = 0xffff;
      decoderMock.tupltype = 'tuple type';
      await expect(decodePNMImage('file' as any)).resolves.toEqual({
         data: new Uint8Array([0x00, 0x7f, 0xff, 0x7f]),
         width: 2,
         height: 2,
         format: 'tuple type',
      });
   });

   describe('reader', () => {
      let fileReaderMock: {
         readAsArrayBuffer: jest.Mock;
      };
      let fileReaderSpy: jest.SpyInstance;
      let fileMock: {
         slice: jest.Mock;
      };
      let reader: Function;

      beforeEach(async () => {
         fileReaderMock = {
            readAsArrayBuffer: jest.fn(),
         };
         fileReaderMock.readAsArrayBuffer.mockReturnValue('buffer');
         fileReaderSpy = jest.spyOn(window as any, 'FileReaderSync');
         fileReaderSpy.mockImplementation(function FileReaderSync() {
            return fileReaderMock;
         });
         fileMock = {
            slice: jest.fn(),
         };
         fileMock.slice.mockReturnValue('slice');
         decoderMock.data = new Uint8Array();
         await decodePNMImage(fileMock as any);
         [[reader]] = decoderSpy.mock.calls;
      });

      it('reads a slice from the file', () => {
         expect(fileReaderSpy).toHaveBeenCalledWith();
         expect(reader(10)).toBe('buffer');
         expect(fileMock.slice).toHaveBeenCalledWith(0, 10);
         expect(fileReaderMock.readAsArrayBuffer).toHaveBeenCalledWith('slice');
      });

      it('reads each slice after each other', () => {
         const buffer1 = {
            byteLength: 10,
         };
         const buffer2 = {
            byteLength: 20,
         };
         fileReaderMock.readAsArrayBuffer.mockReturnValueOnce(buffer1);
         fileReaderMock.readAsArrayBuffer.mockReturnValueOnce(buffer2);
         expect(reader(10)).toBe(buffer1);
         expect(fileMock.slice).toHaveBeenCalledWith(0, 10);
         expect(reader(20)).toBe(buffer2);
         expect(fileMock.slice).toHaveBeenCalledWith(10, 30);
         expect(fileMock.slice).toHaveBeenCalledTimes(2);
         expect(fileReaderMock.readAsArrayBuffer).toHaveBeenCalledTimes(2);
      });
   });
});
