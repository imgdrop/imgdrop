// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as rgba from '../color/rgba';
import { decodeRawImage } from './raw';
import * as worker from './worker/worker';

describe(decodeRawImage, () => {
   let callWorkerSpy: jest.SpyInstance;
   let uploadRGBSpy: jest.SpyInstance;

   beforeEach(() => {
      callWorkerSpy = jest.spyOn(worker, 'callWorker');
      uploadRGBSpy = jest.spyOn(rgba, 'uploadRGB');
   });

   it('decodes a raw image using the worker', async () => {
      callWorkerSpy.mockResolvedValue({
         data: 'data',
         width: 100,
         height: 200,
      });
      uploadRGBSpy.mockReturnValue('canvas');
      await expect(decodeRawImage('file' as any)).resolves.toBe('canvas');
      expect(callWorkerSpy).toHaveBeenCalledWith({
         name: 'decodeRawImage',
         args: ['file'],
      });
      expect(uploadRGBSpy).toHaveBeenCalledWith('data', 100, 200);
   });
});
