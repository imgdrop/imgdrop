// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as sentry from '@sentry/browser';
import { logError } from './logging';

describe(logError, () => {
   let captureExceptionSpy: jest.SpyInstance;

   beforeEach(() => {
      captureExceptionSpy = jest.spyOn(sentry, 'captureException');
   });

   it('logs an error', async () => {
      await logError('error' as any);
      expect(captureExceptionSpy).toHaveBeenCalledWith('error');
   });
});
