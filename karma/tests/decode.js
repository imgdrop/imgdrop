import { downloadPixels, pngImage, jpegImage, webpImage } from '../util';
import { decodeImage } from '../../src/decode/decode';

describe('decodeImage', () => {
   it('can decode a PNG image', async () => {
      const response = await fetch(pngImage);
      const blob = await response.blob();
      const image = await decodeImage(new File([blob], '2x2.png'));
      expect(image.width).toBe(2);
      expect(image.height).toBe(2);
      // prettier-ignore
      expect(downloadPixels(image)).toEqual(new Uint8Array([
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
      ]));
   });

   it('can decode a JPEG image', async () => {
      const response = await fetch(jpegImage);
      const blob = await response.blob();
      const image = await decodeImage(new File([blob], '2x2.png'));
      expect(image.width).toBe(2);
      expect(image.height).toBe(2);
      // prettier-ignore
      expect(downloadPixels(image)).toEqual(new Uint8Array([
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
      ]));
   });

   it('can decode a WebP image', async () => {
      const response = await fetch(webpImage);
      const blob = await response.blob();
      const image = await decodeImage(new File([blob], '2x2.png'));
      expect(image.width).toBe(2);
      expect(image.height).toBe(2);
      // prettier-ignore
      expect(downloadPixels(image)).toEqual(new Uint8Array([
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
         0xFF, 0xFF, 0xFF, 0xFF,
      ]));
   });
});
