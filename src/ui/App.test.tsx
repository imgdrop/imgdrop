import React from 'react';
import TestRenderer from 'react-test-renderer';
import { App } from './App';
import { ImageDrop } from './ImageDrop';
import * as useConverter from './useImageConverter';

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
