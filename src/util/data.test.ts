// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { checkData, createSyncDataReader, readBlobData } from './data';

describe(createSyncDataReader, () => {
   let fileReaderMock: {
      readAsArrayBuffer: jest.Mock;
   };
   let fileReaderSpy: jest.SpyInstance;
   let fileMock: {
      slice: jest.Mock;
   };
   let reader: (size: number) => ArrayBuffer;

   beforeEach(() => {
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
      reader = createSyncDataReader(fileMock as any);
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

describe(readBlobData, () => {
   let fileReaderMock: {
      onload?: () => void;
      onerror?: () => void;
      readAsArrayBuffer: jest.Mock;
      error?: string;
      result?: string;
   };
   let fileReaderSpy: jest.SpyInstance;

   beforeEach(() => {
      fileReaderMock = {
         readAsArrayBuffer: jest.fn(),
      };
      fileReaderSpy = jest.spyOn(window, 'FileReader');
      fileReaderSpy.mockImplementation(function FileReader() {
         return fileReaderMock;
      });
   });

   it('reads the data from a blob', async () => {
      const promise = readBlobData('blob' as any);
      expect(fileReaderSpy).toHaveBeenCalledWith();
      expect(fileReaderMock.onload).toBeInstanceOf(Function);
      expect(fileReaderMock.onerror).toBeInstanceOf(Function);
      expect(fileReaderMock.readAsArrayBuffer).toHaveBeenCalledWith('blob');

      fileReaderMock.result = 'data';
      fileReaderMock.onload!();
      await expect(promise).resolves.toBe('data');
   });

   it('rejects if onerror is called', async () => {
      const promise = readBlobData('blob' as any);
      fileReaderMock.error = 'error';
      fileReaderMock.onerror!();
      await expect(promise).rejects.toBe('error');
   });
});

describe(checkData, () => {
   it('returns true if the data matches the array', () => {
      expect(checkData(new Uint8Array([1, 2, 3, 4, 5]), [2, 3, 4], 1)).toBeTruthy();
   });

   it('returns false if the data does not match the array', () => {
      expect(checkData(new Uint8Array([1, 2, 3, 4, 5]), [4, 3, 2], 1)).toBeFalsy();
   });

   it('defaults to an offset of 0', () => {
      expect(checkData(new Uint8Array([1, 2, 3, 4, 5]), [1, 2, 3])).toBeTruthy();
   });

   it('returns false if the data is too short', () => {
      expect(checkData(new Uint8Array([1, 2, 3]), [2, 3, 4], 1)).toBeFalsy();
   });
});
