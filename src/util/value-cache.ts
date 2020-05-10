// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

export class ValueCache<T> {
   private static currentlyCached: ValueCache<unknown>[] = [];

   static clearCached(): void {
      this.currentlyCached.forEach((cache) => {
         // eslint-disable-next-line no-param-reassign
         delete cache.cache;
      });
      this.currentlyCached = [];
   }

   private cache?: T;

   get value(): T {
      if (this.cache === undefined) {
         this.cache = this.callback();
         ValueCache.currentlyCached.push(this);
      }
      return this.cache;
   }

   constructor(private readonly callback: () => T) {}
}
