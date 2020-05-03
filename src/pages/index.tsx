import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet';
import { App } from '../ui/App';

const Index: React.FC = () => {
   return (
      <>
         <Helmet>
            <html lang='en' />
            <title>Image Drop - Online Image Converter</title>
            <meta
               name='description'
               content={
                  'Just drop an image to instantly convert it to PNG. ' +
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

export default Index;
