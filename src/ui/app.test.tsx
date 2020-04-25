import React from 'react';
import TestRenderer from 'react-test-renderer';
import { App } from './app';
import { ImageDrop } from './image-drop';
import * as useConverter from './use-image-converter';

describe(App, () => {
   let convertImageMock: jest.Mock;
   let useConverterSpy: jest.SpyInstance;
   let renderer: TestRenderer.ReactTestRenderer;

   beforeEach(() => {
      convertImageMock = jest.fn();
      useConverterSpy = jest.spyOn(useConverter, 'useImageConverter');
      useConverterSpy.mockReturnValue(convertImageMock);
      renderer = TestRenderer.create(<App />);
   });

   it('matches the snapshot', () => {
      expect(renderer.toJSON()).toMatchSnapshot();
   });

   it('converts an image when dropped', () => {
      renderer.root.findByType(ImageDrop).props.onImageDropped('file');
      expect(convertImageMock).toHaveBeenCalledWith('file');
   });
});
