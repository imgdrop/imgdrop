// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { convertImage } from './convert';
import * as decode from './decode/decode';
import { timeoutPromise } from './util/util';

describe(convertImage, () => {
   let imageMock: {
      toBlob: jest.Mock;
   };
   let decodeImageSpy: jest.SpyInstance;
   let linkMock: {
      href?: string;
      download?: string;
      click: jest.Mock;
   };
   let createElementSpy: jest.SpyInstance;
   let createURLSpy: jest.SpyInstance;
   let revokeURLSpy: jest.SpyInstance;

   beforeEach(() => {
      imageMock = {
         toBlob: jest.fn(),
      };
      decodeImageSpy = jest.spyOn(decode, 'decodeImage');
      decodeImageSpy.mockResolvedValue(imageMock);
      linkMock = {
         click: jest.fn(),
      };
      createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockReturnValue(linkMock);
      createURLSpy = jest.spyOn(URL, 'createObjectURL');
      createURLSpy.mockReturnValue('object/url');
      revokeURLSpy = jest.spyOn(URL, 'revokeObjectURL');
   });

   it('converts an image', async () => {
      imageMock.toBlob.mockImplementation((callback) => callback('blob'));
      const fileMock = {
         name: 'filename.jpg',
      };

      await convertImage(fileMock as any);
      expect(decodeImageSpy).toHaveBeenCalledWith(fileMock);
      expect(imageMock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createURLSpy).toHaveBeenCalledWith('blob');
      expect(linkMock.href).toBe('object/url');
      expect(linkMock.download).toBe('filename.png');
      expect(linkMock.click).toHaveBeenCalledWith();
      expect(revokeURLSpy).toHaveBeenCalledWith('object/url');
   });

   it('rejects if toBlob returns null', async () => {
      imageMock.toBlob.mockImplementation((callback) => callback(null));
      await expect(convertImage('file' as any)).rejects.toBeInstanceOf(Error);
      expect(createElementSpy).not.toHaveBeenCalled();
   });

   it('queues multiple conversion attempts', async () => {
      const fileMock1 = {
         name: 'filename1.jpg',
      };
      const fileMock2 = {
         name: 'filename2.png',
      };

      const conversion1 = convertImage(fileMock1 as any);
      const conversion2 = convertImage(fileMock2 as any);
      await timeoutPromise();
      expect(decodeImageSpy).toHaveBeenCalledWith(fileMock1);
      expect(decodeImageSpy).not.toHaveBeenCalledWith(fileMock2);
      expect(decodeImageSpy).toHaveBeenCalledTimes(1);

      imageMock.toBlob.mock.calls[0][0]('blob1');
      await conversion1;
      await timeoutPromise();
      expect(decodeImageSpy).toHaveBeenCalledWith(fileMock2);
      expect(decodeImageSpy).toHaveBeenCalledTimes(2);

      imageMock.toBlob.mock.calls[1][0]('blob2');
      await conversion2;
   });

   it('runs later queued images if the first one failed', async () => {
      decodeImageSpy.mockRejectedValueOnce('error');
      imageMock.toBlob.mockImplementation((callback) => callback('blob'));
      const fileMock1 = 'file1';
      const fileMock2 = {
         name: 'filename2.jpg',
      };

      const conversion1 = convertImage(fileMock1 as any);
      const conversion2 = convertImage(fileMock2 as any);
      await expect(conversion1).rejects.toBe('error');
      await conversion2;
   });
});
