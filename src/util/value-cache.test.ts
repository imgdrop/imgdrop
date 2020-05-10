// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ValueCache } from './value-cache';

describe(ValueCache, () => {
   let callbackMock: jest.Mock;
   let valueCache: ValueCache<string>;

   beforeEach(() => {
      callbackMock = jest.fn();
      valueCache = new ValueCache(callbackMock);
   });

   describe('value', () => {
      it('calls the callback to get the value', () => {
         callbackMock.mockReturnValue('value');
         expect(valueCache.value).toBe('value');
         expect(callbackMock).toHaveBeenCalledWith();
      });

      it('caches the result for next tiem', () => {
         callbackMock.mockReturnValueOnce('value 2');
         expect(valueCache.value).toBe('value 2');
         expect(valueCache.value).toBe('value 2');
         expect(callbackMock).toHaveBeenCalledTimes(1);
      });

      it('does not call the callback until the value is first requested', () => {
         callbackMock.mockReturnValue('value 3');
         expect(callbackMock).not.toHaveBeenCalled();
         expect(valueCache.value).toBe('value 3');
      });
   });

   describe('clearCached', () => {
      it('clears all current cached values', () => {
         callbackMock.mockReturnValue('value 4');
         expect(valueCache.value).toBe('value 4');
         callbackMock.mockReturnValue('value 5');
         ValueCache.clearCached();
         expect(valueCache.value).toBe('value 5');
         expect(callbackMock).toHaveBeenCalledTimes(2);
      });
   });
});
