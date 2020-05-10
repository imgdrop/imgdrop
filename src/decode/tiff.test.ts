// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as rgba from '../color/rgba';
import { checkTiffImage, decodeTiffImage } from './tiff';
import * as worker from './worker/worker';

describe(checkTiffImage, () => {
   it('returns true for TIFF headers', () => {
      // prettier-ignore
      expect(checkTiffImage(new Uint8Array([
         0x49, 0x49, 0x2A, 0x00,
         0x11, 0x22, 0x33, 0x44,
      ]))).toBeTruthy();

      // prettier-ignore
      expect(checkTiffImage(new Uint8Array([
         0x4D, 0x4D, 0x00, 0x2A,
         0x99, 0x88, 0x77, 0x66,
      ]))).toBeTruthy();
   });

   it('returns false for non-TIFF headers', () => {
      // prettier-ignore
      expect(checkTiffImage(new Uint8Array([
         0x89, 0x50, 0x4E, 0x47,
         0x0D, 0x0A, 0x1A, 0x0A,
         0x57, 0x45, 0x42, 0x50,
      ]))).toBeFalsy();

      // prettier-ignore
      expect(checkTiffImage(new Uint8Array([
         0x49, 0x49, 0x11, 0x00,
         0x99, 0x88, 0x77, 0x66,
      ]))).toBeFalsy();
   });
});

describe(decodeTiffImage, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadRGBASpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadRGBASpy = jest.spyOn(rgba, 'uploadRGBA');
   });

   it('decodes a raw image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         width: 100,
         height: 200,
      });
      uploadRGBASpy.mockReturnValue('canvas');
      await expect(decodeTiffImage('file' as any)).resolves.toBe('canvas');
      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeTiffImage',
         args: ['file'],
      });
      expect(uploadRGBASpy).toHaveBeenCalledWith('data', 100, 200);
   });
});
