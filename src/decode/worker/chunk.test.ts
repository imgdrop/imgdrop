/* eslint-disable import/first */
import * as webp from './webp';
import './chunk';

jest.mock('./webp', () => ({
   decodeWebpImage: jest.fn(),
}));

jest.mock('./tiff', () => ({}));
jest.mock('./jp2', () => ({}));
jest.mock('./raw', () => ({}));

describe(onmessage!, () => {
   let postMessageSpy: jest.SpyInstance;
   let decodeWebpSpy: jest.SpyInstance;

   beforeEach(() => {
      postMessageSpy = jest.spyOn(window, 'postMessage');
      postMessageSpy.mockReturnValue(undefined);
      decodeWebpSpy = jest.spyOn(webp, 'decodeWebpImage');
   });

   it('it calls the specified function', async () => {
      const resultMock = {
         data: {
            buffer: 'buffer',
         },
      };
      decodeWebpSpy.mockResolvedValue(resultMock);

      await (onmessage as Function)({
         data: {
            name: 'decodeWebpImage',
            args: ['foo', 'bar'],
         },
      } as any);

      expect(decodeWebpSpy).toHaveBeenCalledWith('foo', 'bar');
      expect(postMessageSpy).toHaveBeenCalledWith(resultMock, ['buffer']);
   });

   describe('error', () => {
      beforeEach(() => {
         jest.useFakeTimers();
      });

      afterEach(() => {
         jest.useRealTimers();
      });

      it('throws an error outside of the promise on rejections', async () => {
         decodeWebpSpy.mockRejectedValue('error');
         await (onmessage as Function)({
            data: {
               name: 'decodeWebpImage',
               args: [],
            },
         } as any);

         expect(() => jest.advanceTimersByTime(0)).toThrow('error');
      });
   });
});
