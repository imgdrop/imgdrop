// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useSnackbar } from 'notistack';
import { convertImage } from '../convert';
import { logError } from '../logging/logging';

export function useImageConverter(): (files: File[]) => void {
   const { enqueueSnackbar, closeSnackbar } = useSnackbar();
   return async (files): Promise<void> => {
      if (files.length < 1) {
         return;
      }

      let message = 'Converting images...';
      if (files.length === 1) {
         message = `Converting '${files[0].name}'...`;
      }
      const key = enqueueSnackbar(message, {
         variant: 'info',
         persist: true,
      });

      await Promise.all(
         files.map(async (file) => {
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
         })
      );
      closeSnackbar(key);
   };
}
