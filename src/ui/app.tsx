import { useImageConverter } from './use-image-converter';
import { ImageDrop } from './image-drop';
import React from 'react';

export const App: React.FC = () => {
   const convertImage = useImageConverter();
   return <ImageDrop onImageDropped={convertImage} />
};
