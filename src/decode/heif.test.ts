import * as rgba from '../color/rgba';
import { checkHeifImage, decodeHeifImage } from './heif';
import * as worker from './worker/worker';

describe(checkHeifImage, () => {
   it('returns true for HEIF headers', () => {
      // prettier-ignore
      expect(checkHeifImage(new Uint8Array([
         0x11, 0x22, 0x33, 0x44,
         0x66, 0x74, 0x79, 0x70,
         0x99, 0x88, 0x77, 0x66,
         0xAA, 0xBB, 0xCC, 0xDD,
         0x68, 0x65, 0x69, 0x63,
         0xFF, 0xEE, 0xDD, 0xCC,
      ]))).toBeTruthy();

      // prettier-ignore
      expect(checkHeifImage(new Uint8Array([
         0x11, 0x22, 0x33, 0x44,
         0x66, 0x74, 0x79, 0x70,
         0x99, 0x88, 0x77, 0x66,
         0xAA, 0xBB, 0xCC, 0xDD,
         0xFF, 0xEE, 0xDD, 0xCC,
         0x68, 0x65, 0x69, 0x78,
      ]))).toBeTruthy();
   });

   it('returns false for non HEIF headers', () => {
      // prettier-ignore
      expect(checkHeifImage(new Uint8Array([
         0x89, 0x50, 0x4E, 0x47,
         0x0D, 0x0A, 0x1A, 0x0A,
         0x57, 0x45, 0x42, 0x50,
      ]))).toBeFalsy();

      // prettier-ignore
      expect(checkHeifImage(new Uint8Array([
         0x11, 0x22, 0x33, 0x44,
         0x66, 0x74, 0x79, 0x70,
         0x68, 0x65, 0x69, 0x63,
         0x99, 0x88, 0x77, 0x66,
      ]))).toBeFalsy();
   });
});

describe(decodeHeifImage, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadRGBA');
   });

   it('decodes a HEIF image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         width: 100,
         height: 200,
      });
      uploadRGBASpy.mockResolvedValue('image');
      await expect(decodeHeifImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeHeifImage',
         args: ['file'],
      });
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 100, 200);
   });
});
