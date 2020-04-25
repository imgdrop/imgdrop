import * as sentry from '@sentry/browser';
import { logError } from './logging';

describe(logError, () => {
   it('logs an error', async () => {
      const captureExceptionSpy = jest.spyOn(sentry, 'captureException');
      await logError('error' as any);
      expect(captureExceptionSpy).toHaveBeenCalledWith('error');
   });
});
