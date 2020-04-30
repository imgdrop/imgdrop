import { downloadPixels, webpImage } from '../util';
import { decodeWebpImage } from '../../src/decode/webp';

describe('decodeWebpImage', () => {
   it('can decode a WebP image', async () => {
      const response = await fetch(webpImage);
      const blob = await response.blob();
      const image = await decodeWebpImage(new File([blob], '2x2.png'));
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
