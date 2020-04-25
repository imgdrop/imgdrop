import * as decodeHTML from './html';
import { decodeImage } from '.';

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
      await expect(decodeImage('file' as any)).rejects.toBeInstanceOf(Error);
      expect(decodeHTMLSpy).toHaveBeenCalledWith('file');
   });
});
