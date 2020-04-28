import { checkData, readBlobData } from './data';

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
