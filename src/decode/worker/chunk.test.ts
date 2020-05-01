const webpMock = {
   decodeWebpImage: jest.fn()
};

jest.mock('./webp', () => webpMock);

/* eslint-disable import/first */
import * as webp from './webp';
import './chunk';

describe(onmessage!, () => {
   let postMessageSpy: jest.SpyInstance;
   let decodeWebpSpy: jest.SpyInstance;

   beforeEach(() => {
      postMessageSpy = jest.spyOn(window, 'postMessage');
      postMessageSpy.mockReturnValue(undefined);
      decodeWebpSpy = jest.spyOn(webp, 'decodeWebpImage');
   });

   it('it calls the specified function', async () => {
      decodeWebpSpy.mockResolvedValue('result');
      await (onmessage as Function)({
         data: {
            name: 'decodeWebpImage',
            args: ['foo', 'bar'],
         },
      } as any);

      expect(decodeWebpSpy).toHaveBeenCalledWith('foo', 'bar');
      expect(postMessageSpy).toHaveBeenCalledWith('result');
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
