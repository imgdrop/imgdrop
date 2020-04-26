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
