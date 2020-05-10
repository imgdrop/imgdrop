// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Helmet } from 'react-helmet';
import { App } from '../ui/App';

export interface IndexProps {
   pageContext: {
      imageName?: string;
   };
}

const Index: React.FC<IndexProps> = ({ pageContext }) => {
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
         <SnackbarProvider maxSnack={5}>
            <App imageName={pageContext.imageName} />
         </SnackbarProvider>
      </>
   );
};

export default Index;
