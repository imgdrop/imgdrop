// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as utif from 'utif';
import { decodeTiffImage } from './tiff';

describe(decodeTiffImage, () => {
   let ifdMock: {
      data?: string;
      width: number;
      height: number;
      t259: [number];
      t262: [number];
   };
   let decodeSpy: jest.SpyInstance;
   let decodeImageSpy: jest.SpyInstance;
   let toRGBASpy: jest.SpyInstance;

   beforeEach(() => {
      ifdMock = {
         data: 'data',
         width: 100,
         height: 200,
         t259: [1],
         t262: [0],
      };
      decodeSpy = jest.spyOn(utif, 'decode');
      decodeSpy.mockReturnValue([ifdMock]);
      decodeImageSpy = jest.spyOn(utif, 'decodeImage');
      toRGBASpy = jest.spyOn(utif, 'toRGBA8');
      toRGBASpy.mockReturnValue('rgba');
   });

   it('decodes an image using UTIF', async () => {
      const { buffer } = new Uint8Array([1, 2, 3, 4, 5]);
      await expect(decodeTiffImage(new Blob([buffer]) as any)).resolves.toEqual({
         data: 'rgba',
         width: 100,
         height: 200,
      });

      expect(decodeSpy).toHaveBeenCalledWith(buffer);
      expect(decodeImageSpy).toHaveBeenCalledWith(buffer, ifdMock);
      expect(toRGBASpy).toHaveBeenCalledWith(ifdMock);
   });

   it('rejects if the data is undefined', async () => {
      delete ifdMock.data;
      await expect(decodeTiffImage(new Blob() as any)).rejects.toBeInstanceOf(Error);
      expect(toRGBASpy).not.toHaveBeenCalled();
   });

   it('swaps compression 32946 for compression 8', async () => {
      ifdMock.t259[0] = 32946;
      await decodeTiffImage(new Blob([]) as any);
      expect(ifdMock.t259[0]).toBe(8);
   });

   it('rejects if the compression is not supported', async () => {
      ifdMock.t259[0] = -1;
      await expect(decodeTiffImage(new Blob([]) as any)).rejects.toBeInstanceOf(Error);
      expect(decodeImageSpy).not.toHaveBeenCalled();
   });

   it('rejects if the protometric interpretation is not supported', async () => {
      ifdMock.t262[0] = -1;
      await expect(decodeTiffImage(new Blob([]) as any)).rejects.toBeInstanceOf(Error);
      expect(toRGBASpy).not.toHaveBeenCalled();
   });
});
