// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { ImageDrop } from './ImageDrop';
import { useImageConverter } from './useImageConverter';

export interface AppProps {
   imageName?: string;
}

export const App: React.FC<AppProps> = ({ imageName }) => {
   const convertImage = useImageConverter();
   return <ImageDrop imageName={imageName} onImageDropped={convertImage} />;
};
