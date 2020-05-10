// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { shaderMocks } from './shader-cache-array';

export class ShaderCache {
   begin = jest.fn();

   uploadTexture = jest.fn();

   uploadOptionalTexture = jest.fn();

   end = jest.fn();

   constructor(public meta: string) {
      shaderMocks.push(this);
   }
}
