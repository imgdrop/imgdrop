import { decodeHTMLImage } from './html';

describe(decodeHTMLImage, () => {
   let createURLSpy: jest.SpyInstance;
   let revokeURLSpy: jest.SpyInstance;
   let imageMock: {
      onload?: () => void;
      onerror?: () => void;
      src?: string;
      width: number;
      height: number;
   };
   let canvasMock: {
      width?: number;
      height?: number;
      getContext: jest.Mock;
   };
   let createElementSpy: jest.SpyInstance;

   beforeEach(() => {
      createURLSpy = jest.spyOn(URL, 'createObjectURL');
      createURLSpy.mockReturnValue('object/url');
      revokeURLSpy = jest.spyOn(URL, 'revokeObjectURL');
      imageMock = {
         width: 100,
         height: 200,
      };
      canvasMock = {
         getContext: jest.fn(),
      };
      createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockImplementation((tag) => {
         if (tag === 'img') {
            return imageMock;
         }
         return canvasMock;
      });
   });

   it('decodes an image using HTML', async () => {
      const contextMock = {
         drawImage: jest.fn(),
         canvas: canvasMock,
      };
      canvasMock.getContext.mockReturnValue(contextMock);

      const promise = decodeHTMLImage('file' as any);
      expect(createURLSpy).toHaveBeenCalledWith('file');
      expect(createElementSpy).toHaveBeenCalledWith('img');
      expect(imageMock.onload).toBeInstanceOf(Function);
      expect(imageMock.onerror).toBeInstanceOf(Function);
      expect(imageMock.src).toBe('object/url');

      imageMock.onload!();
      await expect(promise).resolves.toBe(canvasMock);
      expect(revokeURLSpy).toHaveBeenCalledWith('object/url');
      expect(canvasMock.width).toBe(100);
      expect(canvasMock.height).toBe(200);
      expect(contextMock.drawImage).toHaveBeenCalledWith(imageMock, 0, 0);
   });

   it('rejects if onerror is called', async () => {
      const promise = decodeHTMLImage('file' as any);
      expect(createURLSpy).toHaveBeenCalledWith('file');
      expect(createElementSpy).toHaveBeenCalledWith('img');
      expect(imageMock.onload).toBeInstanceOf(Function);
      expect(imageMock.onerror).toBeInstanceOf(Function);
      expect(imageMock.src).toBe('object/url');

      imageMock.onerror!();
      await expect(promise).rejects.toBeInstanceOf(Error);
      expect(revokeURLSpy).toHaveBeenCalledWith('object/url');
   });
});
