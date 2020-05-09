import * as gray from '../color/gray';
import * as rgba from '../color/rgba';
import * as yuv from '../color/yuv';
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
   let uploadYUVSpy: jest.SpyInstance;
   let uploadPlanarRGBASpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;
   let uploadRGBSpy: jest.SpyInstance;
   let uploadGraySpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadYUVSpy = jest.spyOn(yuv, 'uploadPlanarYUV');
      uploadPlanarRGBASpy = jest.spyOn(rgba, 'uploadPlanarRGBA');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadRGBA');
      uploadRGBSpy = jest.spyOn(rgba, 'uploadRGB');
      uploadGraySpy = jest.spyOn(gray, 'uploadPlanarGray');
   });

   it('decodes a HEIF YUV image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         colorspace: 0,
         planes: ['y', 'cb', 'cr', 'alpha'],
      });
      uploadYUVSpy.mockResolvedValue('image');
      await expect(decodeHeifImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeHeifImage',
         args: ['file'],
      });
      expect(uploadYUVSpy).toHaveBeenCalledWith('data', 'y', 'cb', 'cr', 'alpha');
   });

   it('decodes a HEIF RGBA planar image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         colorspace: 1,
         chroma: 3,
         planes: ['red', 'green', 'blue', 'alpha'],
      });
      uploadPlanarRGBASpy.mockResolvedValue('image');
      await expect(decodeHeifImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeHeifImage',
         args: ['file'],
      });
      expect(uploadPlanarRGBASpy).toHaveBeenCalledWith(
         'data',
         'red',
         'green',
         'blue',
         'alpha'
      );
   });

   it('decoes a HEIF RGBA image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         colorspace: 1,
         chroma: 11,
         planes: [
            {
               width: 100,
               height: 200,
            },
         ],
      });
      uploadRGBASpy.mockResolvedValue('image');
      await expect(decodeHeifImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeHeifImage',
         args: ['file'],
      });
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 100, 200);
   });

   it('decoes a HEIF RGB image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         colorspace: 1,
         chroma: 10,
         planes: [
            {
               width: 100,
               height: 200,
            },
         ],
      });
      uploadRGBSpy.mockResolvedValue('image');
      await expect(decodeHeifImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeHeifImage',
         args: ['file'],
      });
      expect(uploadRGBSpy).toHaveBeenCalledWith('data', 100, 200);
   });

   it('decodes a HEIF monochrome image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         colorspace: 2,
         planes: ['gray', 'alpha'],
      });
      uploadGraySpy.mockResolvedValue('image');
      await expect(decodeHeifImage('file' as any)).resolves.toBe('image');

      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeHeifImage',
         args: ['file'],
      });
      expect(uploadGraySpy).toHaveBeenCalledWith('data', 'gray', 'alpha');
   });

   it('rejects if it does not recognise the colorspace', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         colorspace: -1,
         planes: ['gray', 'alpha'],
      });
      await expect(decodeHeifImage('file' as any)).rejects.toBeInstanceOf(Error);
   });
});
