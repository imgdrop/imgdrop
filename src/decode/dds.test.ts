import * as rgba from '../color/rgba';
import { checkDDSImage, decodeDDSImage } from './dds';
import * as worker from './worker/worker';

describe(checkDDSImage, () => {
   it('returns true for DDS images', () => {
      // prettier-ignore
      expect(checkDDSImage(new Uint8Array([
         0x44, 0x44, 0x53, 0x20,
         0x7C, 0x00, 0x00, 0x00,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBeTruthy();
   });

   it('returns false for non-DDS images', () => {
      // prettier-ignore
      expect(checkDDSImage(new Uint8Array([
         0x89, 0x50, 0x4E, 0x47,
         0x0D, 0x0A, 0x1A, 0x0A,
         0x57, 0x45, 0x42, 0x50,
      ]))).toBeFalsy();

      // prettier-ignore
      expect(checkDDSImage(new Uint8Array([
         0x44, 0x44, 0x53, 0x20,
         0x70, 0x00, 0x00, 0x00,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBeFalsy();
   });
});

describe(decodeDDSImage, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadRGBA');
   });

   it('decodes a DDS image using the worker and uploads it to the GPU', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         width: 100,
         height: 200,
      });
      uploadRGBASpy.mockReturnValue('image');
      await expect(decodeDDSImage('file' as any)).resolves.toBe('image');
      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeDDSImage',
         args: ['file'],
      });
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 100, 200);
   });
});
