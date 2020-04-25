import { convertImage } from './convert';
import * as decode from './decode/decode';

describe(convertImage, () => {
   let imageMock: {
      toBlob: jest.Mock;
   };
   let decodeImageSpy: jest.SpyInstance;

   beforeEach(() => {
      imageMock = {
         toBlob: jest.fn(),
      };
      decodeImageSpy = jest.spyOn(decode, 'decodeImage');
      decodeImageSpy.mockResolvedValue(imageMock);
   });

   it('converts an image', async () => {
      imageMock.toBlob.mockImplementation((callback) => callback('blob'));
      const linkMock = {
         href: '',
         download: '',
         click: jest.fn(),
      };
      const createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockReturnValue(linkMock as any);
      const fileMock = {
         name: 'filename.jpg',
      };
      const createURLSpy = jest.spyOn(URL, 'createObjectURL');
      createURLSpy.mockReturnValue('object/url');
      const revokeURLSpy = jest.spyOn(URL, 'revokeObjectURL');

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
      expect(decodeImageSpy).toHaveBeenCalledWith('file');
      expect(imageMock.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
   });
});
