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
