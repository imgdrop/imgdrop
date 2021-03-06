// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getPathBasename, getPathExtension } from './path';

describe(getPathExtension, () => {
   it('gets the paths extension', () => {
      expect(getPathExtension('path.png')).toBe('png');
   });

   it('ignores extra dots in path', () => {
      expect(getPathExtension('path.extra.jpg')).toBe('jpg');
   });

   it('returns an empty string if there are no dots', () => {
      expect(getPathExtension('path-none')).toBe('');
   });

   it('makes sure the returned string is lowercase', () => {
      expect(getPathExtension('PATH.PNG')).toBe('png');
   });
});

describe(getPathBasename, () => {
   it('gets the paths basename', () => {
      expect(getPathBasename('path.png')).toBe('path');
   });

   it('ignores extra dots in path', () => {
      expect(getPathBasename('path.extra.jpg')).toBe('path.extra');
   });

   it('returns the whole path if there are no dots', () => {
      expect(getPathBasename('path-none')).toBe('path-none');
   });
});
