import { decodeImage } from './decode';
import * as decodeHTML from './html';

describe(decodeImage, () => {
   let decodeHTMLSpy: jest.SpyInstance;

   beforeEach(() => {
      decodeHTMLSpy = jest.spyOn(decodeHTML, 'decodeHTMLImage');
   });

   it('decodes using HTML by default', async () => {
      decodeHTMLSpy.mockResolvedValue('image');
      const fileMock = {
         name: 'file.png',
         type: 'image/png'
      };
      await expect(decodeImage(fileMock as any)).resolves.toBe('image');
      expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
   });

   it('rejects if all decoders fail', async () => {
      decodeHTMLSpy.mockRejectedValue('error');
      await expect(decodeImage(new File([], 'file'))).rejects.toBeInstanceOf(Error);
   });
});
