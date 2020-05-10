// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { decodeImage } from './decode';
import * as heif from './heif';
import * as html from './html';
import * as jp2 from './jp2';
import * as raw from './raw';
import * as tiff from './tiff';
import * as webp from './webp';

describe(decodeImage, () => {
   let decodeHTMLSpy: jest.SpyInstance;
   let decodeWebpSpy: jest.SpyInstance;
   let decodeTiffSpy: jest.SpyInstance;
   let decodeJP2Spy: jest.SpyInstance;
   let decodeHeifSpy: jest.SpyInstance;
   let decodeRawSpy: jest.SpyInstance;

   beforeEach(() => {
      decodeHTMLSpy = jest.spyOn(html, 'decodeHTMLImage');
      decodeWebpSpy = jest.spyOn(webp, 'decodeWebpImage');
      decodeTiffSpy = jest.spyOn(tiff, 'decodeTiffImage');
      decodeJP2Spy = jest.spyOn(jp2, 'decodeJP2Image');
      decodeHeifSpy = jest.spyOn(heif, 'decodeHeifImage');
      decodeRawSpy = jest.spyOn(raw, 'decodeRawImage');
   });

   describe('HTML', () => {
      it('decodes using HTML by default', async () => {
         decodeHTMLSpy.mockResolvedValue('image');
         const fileMock = {
            name: 'file.png',
            type: 'image/png',
         };
         await expect(decodeImage(fileMock as any)).resolves.toBe('image');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
      });
   });

   describe('WebP', () => {
      let fileMock: File;

      beforeEach(() => {
         // prettier-ignore
         fileMock = new File([new Uint8Array([
            0x52, 0x49, 0x46, 0x46,
            0x00, 0x11, 0x22, 0x33,
            0x57, 0x45, 0x42, 0x50,
            0x99, 0x88, 0x77, 0x66,
         ])], 'file');
      });

      it('decodes using WebP if HTML fails and its a WebP image', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeWebpSpy.mockResolvedValue('webp');
         await expect(decodeImage(fileMock)).resolves.toBe('webp');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
         expect(decodeWebpSpy).toHaveBeenCalledWith(fileMock);
      });

      it('rejects if HTML fails and WebP fails', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeWebpSpy.mockRejectedValue('webp error');
         await expect(decodeImage(fileMock)).rejects.toBe('webp error');
      });
   });

   describe('TIFF', () => {
      let fileMock: File;

      beforeEach(() => {
         // prettier-ignore
         fileMock = new File([new Uint8Array([
            0x49, 0x49, 0x2A, 0x00,
            0x11, 0x22, 0x33, 0x44,
         ])], 'file');
      });

      it('decodes using TIFF if HTML/raw fails and its a TIFF image', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeRawSpy.mockRejectedValue('error');
         decodeTiffSpy.mockResolvedValue('tiff');
         await expect(decodeImage(fileMock)).resolves.toBe('tiff');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
         expect(decodeRawSpy).toHaveBeenCalledWith(fileMock);
         expect(decodeTiffSpy).toHaveBeenCalledWith(fileMock);
      });

      it('rejects if HTML/raw fails and TIFF fails', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeRawSpy.mockRejectedValue('error');
         decodeTiffSpy.mockRejectedValue('tiff error');
         await expect(decodeImage(fileMock)).rejects.toBe('tiff error');
      });
   });

   describe('JP2', () => {
      let jp2FileMock: File;
      let j2kFileMock: File;

      beforeEach(() => {
         // prettier-ignore
         jp2FileMock = new File([new Uint8Array([
            0x00, 0x00, 0x00, 0x0C,
            0x6A, 0x50, 0x20, 0x20,
            0x0D, 0x0A, 0x87, 0x0A,
            0x11, 0x22, 0x33, 0x44,
         ])], 'file');

         // prettier-ignore
         j2kFileMock = new File([new Uint8Array([
            0xFF, 0x4F, 0xFF, 0x51,
            0x11, 0x22, 0x33, 0x44,
         ])], 'file');
      });

      it('decodes using JP2 if HTML fails and its a JP2 image', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeJP2Spy.mockResolvedValue('jp2');
         await expect(decodeImage(jp2FileMock)).resolves.toBe('jp2');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(jp2FileMock);
         expect(decodeJP2Spy).toHaveBeenCalledWith(jp2FileMock, 2);
      });

      it('decodes using JP2 if HTML fails and its a J2K image', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeJP2Spy.mockResolvedValue('j2k');
         await expect(decodeImage(j2kFileMock)).resolves.toBe('j2k');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(j2kFileMock);
         expect(decodeJP2Spy).toHaveBeenCalledWith(j2kFileMock, 0);
      });

      it('rejects if HTML fails and JP2 fails', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeJP2Spy.mockRejectedValue('jp2 error');
         await expect(decodeImage(jp2FileMock)).rejects.toBe('jp2 error');
      });
   });

   describe('HEIF', () => {
      let fileMock: File;

      beforeEach(() => {
         // prettier-ignore
         fileMock = new File([new Uint8Array([
            0x11, 0x22, 0x33, 0x44,
            0x66, 0x74, 0x79, 0x70,
            0x99, 0x88, 0x77, 0x66,
            0xAA, 0xBB, 0xCC, 0xDD,
            0x68, 0x65, 0x69, 0x63,
            0xFF, 0xEE, 0xDD, 0xCC,
         ])], 'file');
      });

      it('decodes using HEIF if HTML fails and its a HEIF image', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeHeifSpy.mockResolvedValue('image');
         await expect(decodeImage(fileMock)).resolves.toBe('image');
         expect(decodeHTMLSpy).toHaveBeenCalledWith(fileMock);
         expect(decodeHeifSpy).toHaveBeenCalledWith(fileMock);
      });

      it('rejects if HTML fails and HEIF fails', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeHeifSpy.mockRejectedValue('heif error');
         await expect(decodeImage(fileMock)).rejects.toBe('heif error');
      });
   });

   describe('raw', () => {
      let fileMock: File;

      beforeEach(() => {
         fileMock = new File([], 'file');
      });

      it('decodes using raw if HTML fails', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeRawSpy.mockResolvedValue('raw');
         await expect(decodeImage(fileMock)).resolves.toBe('raw');
      });

      it('rejects if HTML and raw fails and theres no other decoders', async () => {
         decodeHTMLSpy.mockRejectedValue('error');
         decodeRawSpy.mockRejectedValue('error');
         await expect(decodeImage(fileMock)).rejects.toBeInstanceOf(Error);
      });
   });
});
