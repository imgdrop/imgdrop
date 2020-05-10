// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as gray from '../color/gray';
import * as rgba from '../color/rgba';
import { checkPNMImage, decodePNMImage } from './pnm';
import * as worker from './worker/worker';

describe(checkPNMImage, () => {
   it('returns true for PNM headers', () => {
      expect(checkPNMImage(new Uint8Array([0x50, 0x31, 0x20]))).toBeTruthy();

      expect(checkPNMImage(new Uint8Array([0x50, 0x37, 0x0a]))).toBeTruthy();
   });

   it('returns false for non-PNM headers', () => {
      expect(checkPNMImage(new Uint8Array([0x50, 0x31, 0x32]))).toBeFalsy();

      // prettier-ignore
      expect(checkPNMImage(new Uint8Array([
         0x89, 0x50, 0x4E, 0x47,
         0x0D, 0x0A, 0x1A, 0x0A,
         0x57, 0x45, 0x42, 0x50,
      ]))).toBeFalsy();
   });
});

describe(decodePNMImage, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadGraySpy: jest.SpyInstance;
   let uploadRGBSpy: jest.SpyInstance;
   let uploadGrayAlphaSpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadGraySpy = jest.spyOn(gray, 'uploadPlanarGray');
      uploadRGBSpy = jest.spyOn(rgba, 'uploadRGB');
      uploadGrayAlphaSpy = jest.spyOn(rgba, 'uploadGrayAlpha');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadRGBA');
   });

   it('decodes a PNM black and white image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         width: 100,
         height: 200,
         format: 'BLACKANDWHITE',
      });
      uploadGraySpy.mockReturnValue('gray');
      await expect(decodePNMImage('file' as any)).resolves.toBe('gray');
      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodePNMImage',
         args: ['file'],
      });
      expect(uploadGraySpy).toHaveBeenCalledWith('data', {
         offset: 0,
         width: 100,
         height: 200,
      });
   });

   it('decodes a PNM grayscale image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         width: 100,
         height: 200,
         format: 'GRAYSCALE',
      });
      uploadGraySpy.mockReturnValue('gray');
      await expect(decodePNMImage('file' as any)).resolves.toBe('gray');
      expect(uploadGraySpy).toHaveBeenCalledWith('data', {
         offset: 0,
         width: 100,
         height: 200,
      });
   });

   it('decodes a PNM RGB image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         width: 100,
         height: 200,
         format: 'RGB',
      });
      uploadRGBSpy.mockReturnValue('rgb');
      await expect(decodePNMImage('file' as any)).resolves.toBe('rgb');
      expect(uploadRGBSpy).toHaveBeenCalledWith('data', 100, 200);
   });

   it('decodes a PNM black and white with alpha image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         width: 100,
         height: 200,
         format: 'BLACKANDWHITE_ALPHA',
      });
      uploadGrayAlphaSpy.mockReturnValue('gray alpha');
      await expect(decodePNMImage('file' as any)).resolves.toBe('gray alpha');
      expect(uploadGrayAlphaSpy).toHaveBeenCalledWith('data', 100, 200);
   });

   it('decodes a PNM grayscale alpha image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         width: 100,
         height: 200,
         format: 'GRAYSCALE_ALPHA',
      });
      uploadGrayAlphaSpy.mockReturnValue('gray alpha');
      await expect(decodePNMImage('file' as any)).resolves.toBe('gray alpha');
      expect(uploadGrayAlphaSpy).toHaveBeenCalledWith('data', 100, 200);
   });

   it('decodes a PNM RGBA image using the worker', async () => {
      callWorkerSpy.mockReturnValue({
         data: 'data',
         width: 100,
         height: 200,
         format: 'RGB_ALPHA',
      });
      uploadRGBASpy.mockReturnValue('rgba');
      await expect(decodePNMImage('file' as any)).resolves.toBe('rgba');
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 100, 200);
   });

   it('rejects if it does not recognise the PNM format', async () => {
      callWorkerSpy.mockReturnValue({ format: 'format' });
      await expect(decodePNMImage('file' as any)).rejects.toBeInstanceOf(Error);
   });
});
