import React from 'react';
import { Helmet } from 'react-helmet';
import TestRenderer from 'react-test-renderer';
import Index from '../pages';

describe(Index, () => {
   let renderer: TestRenderer.ReactTestRenderer;

   beforeEach(() => {
      renderer = TestRenderer.create(<Index />);
   });

   it('matches the snapshot', () => {
      expect(renderer.toJSON()).toMatchSnapshot();
      expect(Helmet.peek()).toMatchSnapshot();
   });
});
