// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { createContext, timeoutPromise } from './util';

describe(createContext, () => {
   let canvasMock: {
      width?: number;
      height?: number;
      getContext: jest.Mock;
   };
   let createElementSpy: jest.SpyInstance;

   beforeEach(() => {
      canvasMock = {
         getContext: jest.fn(),
      };
      createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockReturnValue(canvasMock);
   });

   it('creates a context', () => {
      canvasMock.getContext.mockReturnValue('context');
      expect(createContext(100, 200, '2d')).toBe('context');
      expect(createElementSpy).toHaveBeenCalledWith('canvas');
      expect(canvasMock.width).toBe(100);
      expect(canvasMock.height).toBe(200);
      expect(canvasMock.getContext).toHaveBeenCalledWith('2d', undefined);
   });

   it('throws if getContext returns null', () => {
      canvasMock.getContext.mockReturnValue(null);
      expect(() => createContext(100, 200, 'webgl')).toThrow(expect.any(Error));
   });
});

describe(timeoutPromise, () => {
   beforeEach(() => {
      jest.useFakeTimers();
   });

   afterEach(() => {
      jest.useRealTimers();
   });

   it('resolves after the specified time has finished', async () => {
      const promise = timeoutPromise(10000);
      jest.advanceTimersByTime(10000);
      await promise;
   });

   it('defaults to a time of 0', async () => {
      const promise = timeoutPromise();
      jest.advanceTimersByTime(0);
      await promise;
   });
});
