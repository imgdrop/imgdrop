import React from 'react';
import { ImageDrop } from './ImageDrop';
import { useImageConverter } from './useImageConverter';

export const App: React.FC = () => {
   const convertImage = useImageConverter();
   return <ImageDrop onImageDropped={convertImage} />;
};
