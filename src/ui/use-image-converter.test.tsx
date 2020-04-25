import * as notistack from 'notistack';
import * as convert from '../convert';
import * as logging from '../logging';
import { useImageConverter } from './use-image-converter';

describe(useImageConverter, () => {
   let snackbarMock: {
      enqueueSnackbar: jest.Mock;
   };
   let useSnackbarSpy: jest.SpyInstance;
   let convertImageSpy: jest.SpyInstance;

   beforeEach(() => {
      snackbarMock = {
         enqueueSnackbar: jest.fn(),
      };
      useSnackbarSpy = jest.spyOn(notistack, 'useSnackbar');
      useSnackbarSpy.mockReturnValue(snackbarMock);
      convertImageSpy = jest.spyOn(convert, 'convertImage');
   });

   it('converts an image', async () => {
      convertImageSpy.mockResolvedValue(undefined);
      const convertImage = useImageConverter();
      convertImage('file' as any);
      expect(convertImageSpy).toHaveBeenCalledWith('file');

      await new Promise((resolve) => setTimeout(resolve));
      expect(snackbarMock.enqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
         variant: 'success',
      });
   });

   it('logs an error if converting fails', async () => {
      convertImageSpy.mockRejectedValue('error');
      const logErrorSpy = jest.spyOn(logging, 'logError');
      logErrorSpy.mockResolvedValue(undefined);

      const convertImage = useImageConverter();
      convertImage('file' as any);
      expect(convertImageSpy).toHaveBeenCalledWith('file');

      await new Promise((resolve) => setTimeout(resolve));
      expect(logErrorSpy).toHaveBeenCalledWith('error');
      expect(snackbarMock.enqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
         variant: 'error',
      });
   });
});
