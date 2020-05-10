// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export function getPathExtension(path: string): string {
   const dotIndex = path.lastIndexOf('.');
   if (dotIndex === -1) {
      return '';
   }
   return path.substr(dotIndex + 1).toLowerCase();
}

export function getPathBasename(path: string): string {
   const dotIndex = path.lastIndexOf('.');
   if (dotIndex === -1) {
      return path;
   }
   return path.substr(0, dotIndex);
}
