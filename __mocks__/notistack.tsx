import React from 'react';

export const SnackbarProvider: React.FC = ({ children }) => <>{children}</>;

export function useSnackbar(): {
   enqueueSnackbar(): void;
} {
   return {
      enqueueSnackbar(): void {},
   };
}
