// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as gray from '../color/gray';
import * as rgba from '../color/rgba';
import * as yuv from '../color/yuv';
import { checkJP2Image, decodeJP2Image } from './jp2';
import * as worker from './worker/worker';

describe(checkJP2Image, () => {
   it('returns 2 for JP2 headers', () => {
      // prettier-ignore
      expect(checkJP2Image(new Uint8Array([
         0x00, 0x00, 0x00, 0x0C,
         0x6A, 0x50, 0x20, 0x20,
         0x0D, 0x0A, 0x87, 0x0A,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBe(2);

      // prettier-ignore
      expect(checkJP2Image(new Uint8Array([
         0x0D, 0x0A, 0x87, 0x0A,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBe(2);
   });

   it('returns 0 for J2K headers', () => {
      // prettier-ignore
      expect(checkJP2Image(new Uint8Array([
         0xFF, 0x4F, 0xFF, 0x51,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBe(0);
   });

   it('returns -1 for unknown headers', () => {
      // prettier-ignore
      expect(checkJP2Image(new Uint8Array([
         0x89, 0x50, 0x4E, 0x47,
         0x0D, 0x0A, 0x1A, 0x0A,
         0x57, 0x45, 0x42, 0x50,
      ]))).toBe(-1);

      // prettier-ignore
      expect(checkJP2Image(new Uint8Array([
         0x00, 0x00, 0x00, 0x0C,
         0x6A, 0x50, 0x20, 0x20,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBe(-1);

      expect(checkJP2Image(new Uint8Array([]))).toBe(-1);
   });
});

describe(decodeJP2Image, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;
   let uploadGraySpy: jest.SpyInstance;
   let uploadYUVSpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadPlanarRGBA');
      uploadRGBASpy.mockReturnValue('canvas');
      uploadGraySpy = jest.spyOn(gray, 'uploadPlanarGray');
      uploadGraySpy.mockReturnValue('canvas');
      uploadYUVSpy = jest.spyOn(yuv, 'uploadPlanarYUV');
      uploadYUVSpy.mockReturnValue('canvas');
   });

   it('decodes a JP2 sRGB image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         format: 1,
         planes: ['red', 'green', 'blue', 'alpha'],
      });
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe('canvas');
      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeJP2Image',
         args: ['file', 'codec'],
      });
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 'red', 'green', 'blue', 'alpha');
   });

   it('decodes a JP2 gray image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         format: 2,
         planes: ['gray', 'alpha'],
      });
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe('canvas');
      expect(uploadGraySpy).toHaveBeenCalledWith('data', 'gray', 'alpha');
   });

   it('decodes a JP2 sYCC image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         format: 3,
         planes: ['y', 'cb', 'cr', 'alpha'],
      });
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe('canvas');
      expect(uploadYUVSpy).toHaveBeenCalledWith('data', 'y', 'cb', 'cr', 'alpha');
   });

   it('decodes a JP2 eYCC image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         format: 4,
         planes: ['y', 'cb', 'cr', 'alpha'],
      });
      await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe('canvas');
      expect(uploadYUVSpy).toHaveBeenCalledWith('data', 'y', 'cb', 'cr', 'alpha');
   });

   it('rejects if it does not recognise the format', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         format: 5,
      });
      await expect(decodeJP2Image('file' as any, 'codec' as any)).rejects.toBeInstanceOf(
         Error
      );
   });

   describe('guessing', () => {
      it('guesses gray data when there are 2 or less planes', async () => {
         callWorkerSpy.mockReturnValue({
            data: 'data',
            format: 0,
            planes: ['gray', 'alpha'],
         });
         await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe(
            'canvas'
         );
         expect(uploadGraySpy).toHaveBeenCalledWith('data', 'gray', 'alpha');
      });

      it('guesses YUV data when some of the planes are subsampled', async () => {
         const yMock = {
            width: 100,
            height: 200,
         };
         const cbMock = {
            width: 50,
            height: 100,
         };
         const crMock = {
            width: 50,
            height: 100,
         };
         callWorkerSpy.mockReturnValue({
            data: 'data',
            format: 0,
            planes: [yMock, cbMock, crMock],
         });
         await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe(
            'canvas'
         );
         expect(uploadYUVSpy).toHaveBeenCalledWith(
            'data',
            yMock,
            cbMock,
            crMock,
            undefined
         );
      });

      it('guesses RGBA data by default', async () => {
         const redMock = {
            width: 100,
            height: 200,
         };
         const greenMock = {
            width: 100,
            height: 200,
         };
         const blueMock = {
            width: 100,
            height: 200,
         };
         callWorkerSpy.mockReturnValue({
            data: 'data',
            format: 0,
            planes: [redMock, greenMock, blueMock],
         });
         await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe(
            'canvas'
         );
         expect(uploadRGBASpy).toHaveBeenCalledWith(
            'data',
            redMock,
            greenMock,
            blueMock,
            undefined
         );
      });

      it('will also guess for unknown formats', async () => {
         callWorkerSpy.mockReturnValue({
            data: 'data',
            format: -1,
            planes: ['gray', 'alpha'],
         });
         await expect(decodeJP2Image('file' as any, 'codec' as any)).resolves.toBe(
            'canvas'
         );
         expect(uploadGraySpy).toHaveBeenCalledWith('data', 'gray', 'alpha');
      });
   });
});
