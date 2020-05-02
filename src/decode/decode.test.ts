import { decodeImage } from './decode';
import * as html from './html';
import * as webp from './webp';

describe(decodeImage, () => {
   let decodeHTMLSpy: jest.SpyInstance;
   let decodeWebpSpy: jest.SpyInstance;

   beforeEach(() => {
      decodeHTMLSpy = jest.spyOn(html, 'decodeHTMLImage');
      decodeWebpSpy = jest.spyOn(webp, 'decodeWebpImage');
   });

   describe('HTML', () => {
      it('decodes using HTML by default', async () => {
         decodeHTMLSpy.mockResolvedValue('image');
         const fileMock = {
            name: 'file.png',
            type: 'image/png',
         };
         await expect(decodeImage(fileMock as any)).resolves.toBe('image');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
      });

      it('rejects if HTML fails and theres no other decoders', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         await expect(decodeImage(new File([], 'file'))).rejects.toBeInstanceOf(Error);
      });
   });

   describe('WebP', () => {
      let fileMock: File;

      beforeEach(() => {
         // prettier-ignore
         fileMock = new File([new Uint8Array([
            0x52, 0x49, 0x46, 0x46,
            0x00, 0x11, 0x22, 0x33,
            0x57, 0x45, 0x42, 0x50,
            0x99, 0x88, 0x77, 0x66,
         ])], 'file');
      });

      it('decodes using WebP if HTML fails and its a WebP image', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeWebpSpy.mockResolvedValue('webp');
         await expect(decodeImage(fileMock)).resolves.toBe('webp');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
         expect(decodeWebpSpy).toHaveBeenCalledWith(fileMock);
      });

      it('rejects if HTML fails and WebP fails', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeWebpSpy.mockRejectedValue('error');
         await expect(decodeImage(fileMock)).rejects.toBeInstanceOf(Error);
      });
   });
});
