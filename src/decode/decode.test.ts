import { decodeImage } from './decode';
import * as decodeHTML from './html';

describe(decodeImage, () => {
   let decodeHTMLSpy: jest.SpyInstance;

   beforeEach(() => {
      decodeHTMLSpy = jest.spyOn(decodeHTML, 'decodeHTMLImage');
   });

   it('decodes using HTML by default', async () => {
      decodeHTMLSpy.mockResolvedValue('image');
      await expect(decodeImage('file' as any)).resolves.toBe('image');
      expect(decodeHTMLSpy).toHaveBeenCalledWith('file');
   });

   it('rejects if all decoders fail', async () => {
      decodeHTMLSpy.mockRejectedValue('error');
      await expect(decodeImage(new File([], 'file'))).rejects.toBeInstanceOf(Error);
   });
});