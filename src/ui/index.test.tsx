// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Helmet } from 'react-helmet';
import TestRenderer from 'react-test-renderer';
import Index from '../pages';
import { App } from './App';

describe(Index, () => {
   let renderer: TestRenderer.ReactTestRenderer;

   beforeEach(() => {
      renderer = TestRenderer.create(<Index pageContext={{}} />);
   });

   it('matches the snapshot', () => {
      expect(renderer.toJSON()).toMatchSnapshot();
      expect(Helmet.peek()).toMatchSnapshot();
   });

   it('passes through the image name to App', () => {
      renderer = TestRenderer.create(
         <Index
            pageContext={{
               imageName: 'PNG',
            }}
         />
      );
      expect(renderer.root.findByType(App).props.imageName).toBe('PNG');
   });
});
