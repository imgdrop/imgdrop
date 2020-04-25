import React from 'react';
import { ImageDrop } from './image-drop';
import { useImageConverter } from './use-image-converter';

export const App: React.FC = () => {
   const convertImage = useImageConverter();
   return <ImageDrop onImageDropped={convertImage} />;
};
