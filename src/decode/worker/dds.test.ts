// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as dds from '@imgdrop/dds';
import { decodeDDSImage } from './dds';

describe(decodeDDSImage, () => {
   let decoderMock: {
      decode: jest.Mock;
      data?: string;
      width?: number;
      height?: number;
   };
   let decoderSpy: jest.SpyInstance;

   beforeEach(() => {
      decoderMock = {
         decode: jest.fn(),
      };
      decoderSpy = jest.spyOn(dds, 'DDSDecoder');
      decoderSpy.mockImplementation(function DDSDecoder() {
         return decoderMock;
      });
   });

   it('decodes using the DDS library', async () => {
      decoderMock.data = 'data';
      decoderMock.width = 100;
      decoderMock.height = 200;
      await expect(decodeDDSImage('file' as any)).resolves.toEqual({
         data: 'data',
         width: 100,
         height: 200,
      });
      expect(decoderSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(decoderMock.decode).toHaveBeenCalledWith();
   });
});
