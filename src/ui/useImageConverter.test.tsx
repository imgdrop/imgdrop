// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as notistack from 'notistack';
import * as convert from '../convert';
import * as logging from '../logging/logging';
import { timeoutPromise } from '../util/util';
import { useImageConverter } from './useImageConverter';

describe(useImageConverter, () => {
   let snackbarMock: {
      enqueueSnackbar: jest.Mock;
      closeSnackbar: jest.Mock;
   };
   let useSnackbarSpy: jest.SpyInstance;
   let convertImageSpy: jest.SpyInstance;
   let logErrorSpy: jest.SpyInstance;

   beforeEach(() => {
      snackbarMock = {
         enqueueSnackbar: jest.fn(),
         closeSnackbar: jest.fn(),
      };
      useSnackbarSpy = jest.spyOn(notistack, 'useSnackbar');
      useSnackbarSpy.mockReturnValue(snackbarMock);
      convertImageSpy = jest.spyOn(convert, 'convertImage');
      logErrorSpy = jest.spyOn(logging, 'logError');
      logErrorSpy.mockResolvedValue(undefined);
   });

   it('converts a set of images', async () => {
      snackbarMock.enqueueSnackbar.mockReturnValueOnce('key');
      convertImageSpy.mockResolvedValue(undefined);
      const convertImage = useImageConverter();
      convertImage(['file1', 'file2'] as any);
      expect(convertImageSpy).toHaveBeenCalledWith('file1');
      expect(convertImageSpy).toHaveBeenCalledWith('file2');
      expect(snackbarMock.enqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
         variant: 'info',
         persist: true,
      });

      await timeoutPromise();
      expect(snackbarMock.enqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
         variant: 'success',
      });
      expect(snackbarMock.closeSnackbar).toHaveBeenCalledWith('key');
      expect(snackbarMock.enqueueSnackbar).toHaveBeenCalledTimes(3);
   });

   it('logs an error if converting fails', async () => {
      convertImageSpy.mockRejectedValue('error');
      const convertImage = useImageConverter();
      convertImage([{ name: 'file' }] as any);

      await timeoutPromise();
      expect(logErrorSpy).toHaveBeenCalledWith('error');
      expect(snackbarMock.enqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
         variant: 'error',
      });
      expect(snackbarMock.enqueueSnackbar).not.toHaveBeenCalledWith(expect.any(String), {
         variant: 'success',
      });
      expect(snackbarMock.closeSnackbar).toHaveBeenCalled();
   });

   it('instantly returns for zero files', async () => {
      const convertImage = useImageConverter();
      convertImage([]);

      await timeoutPromise();
      expect(snackbarMock.enqueueSnackbar).not.toHaveBeenCalled();
      expect(convertImageSpy).not.toHaveBeenCalled();
   });
});
