import { useSnackbar } from 'notistack';
import { convertImage } from '../convert';
import { logError } from '../logging';

export function useImageConverter(): (file: File) => void {
   const { enqueueSnackbar } = useSnackbar();
   return async (file): Promise<void> => {
      try {
         await convertImage(file);
         enqueueSnackbar(`Successfully converted '${file.name}'`, {
            variant: 'success',
         });
      } catch (error) {
         logError(error);
         enqueueSnackbar(`Failed to convert '${file.name}'`, {
            variant: 'error',
         });
      }
   }
}
