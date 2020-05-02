import * as rgba from '../color/rgba';
import { checkWebpImage, decodeWebpImage } from './webp';
import * as worker from './worker/worker';

describe(checkWebpImage, () => {
   it('returns true for WebP headers', () => {
      // prettier-ignore
      expect(checkWebpImage(new Uint8Array([
         0x52, 0x49, 0x46, 0x46,
         0x00, 0x11, 0x22, 0x33,
         0x57, 0x45, 0x42, 0x50,
         0x99, 0x88, 0x77, 0x66,
      ]))).toBeTruthy();
   });

   it('returns false for non WebP headers', () => {
      // prettier-ignore
      expect(checkWebpImage(new Uint8Array([
         0x89, 0x50, 0x4E, 0x47,
         0x0D, 0x0A, 0x1A, 0x0A,
         0x57, 0x45, 0x42, 0x50,
      ]))).toBeFalsy();

      // prettier-ignore
      expect(checkWebpImage(new Uint8Array([
         0x52, 0x49, 0x46, 0x46,
         0x00, 0x11, 0x22, 0x33,
         0x99, 0x88, 0x77, 0x66,
      ]))).toBeFalsy();

      expect(checkWebpImage(new Uint8Array([]))).toBeFalsy();
   });
});

describe(decodeWebpImage, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadRGBA');
   });

   it('decodes a WebP image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         width: 100,
         height: 200,
      });
      uploadRGBASpy.mockResolvedValue('image');
      await expect(decodeWebpImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeWebpImage',
         args: ['file'],
      });
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 100, 200);
   });
});
