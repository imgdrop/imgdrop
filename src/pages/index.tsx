import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet';
import { App } from '../ui/app';

const Index: React.FC = () => {
   return (
      <>
         <Helmet>
            <html lang='en' />
            <title>Image Drop - Fast and Free Online Image Converter</title>
            <meta
               name='description'
               content={
                  'Just drop an image to instantly convert it to PNG. ' +
                  'Very fast and always free. ' +
                  'Supports many different formats both new and old.'
               }
            />
         </Helmet>
         <CssBaseline />
         <SnackbarProvider>
            <App />
         </SnackbarProvider>
      </>
   );
};

// eslint-disable-next-line import/no-default-export
export default Index;
