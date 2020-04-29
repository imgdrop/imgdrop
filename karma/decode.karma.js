import { decodeImage } from '../src/decode/decode';

function downloadPixels(image) {
   const ctx = image.getContext('2d');
   if (ctx !== null) {
      const data = ctx.getImageData(0, 0, image.width, image.height).data;
      return new Uint8Array(data.buffer);
   }

   const gl = image.getContext('webgl');
   const pixels = new Uint8Array(image.width * image.height * 4);
   gl.readPixels(0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
   return pixels;
}

describe('decodeImage', () => {
   it('can decode a PNG image', async () => {
      const response = await fetch(
         'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAABAAAAAQBPJcTWAAAADklEQVR4nGP4DwYMEAoAU7oL9ZisIGcAAAAASUVORK5CYII='
      );
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
      const response = await fetch(
         'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD//gAQTGF2YzU4LjU0LjEwMAD/2wBDAAgEBAQEBAUFBQUFBQYGBgYGBgYGBgYGBgYHBwcICAgHBwcGBgcHCAgICAkJCQgICAgJCQoKCgwMCwsODg4RERT/xABLAAEBAAAAAAAAAAAAAAAAAAAABwEBAAAAAAAAAAAAAAAAAAAAABABAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/AABEIAAIAAgMBIgACEQADEQD/2gAMAwEAAhEDEQA/AL+AD//Z'
      );
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
      const response = await fetch(
         'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAIAAgA0JaQAA3AA/vuUAAA='
      );
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
