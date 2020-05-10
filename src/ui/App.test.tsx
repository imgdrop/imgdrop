// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

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

   it('passes through the image name to ImageDrop', () => {
      renderer = TestRenderer.create(<App imageName='png' />);
      expect(renderer.root.findByType(ImageDrop).props.imageName).toBe('png');
   });
});
