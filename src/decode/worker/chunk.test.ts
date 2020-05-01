import * as webp from './webp';
import './chunk';

jest.mock('./webp', () => ({
   decodeWebpImage: jest.fn(),
}));

describe(globalThis.onmessage!, () => {
   let postMessageSpy: jest.SpyInstance;
   let decodeWebpMock: jest.Mock;

   beforeEach(() => {
      postMessageSpy = jest.spyOn(window, 'postMessage');
      postMessageSpy.mockReturnValue(undefined);
      decodeWebpMock = webp.decodeWebpImage as jest.Mock;
   });

   it('it calls the specified function', async () => {
      decodeWebpMock.mockResolvedValue('result');
      await (onmessage as Function)({
         data: {
            name: 'decodeWebpImage',
            args: ['foo', 'bar'],
         },
      } as any);

      expect(decodeWebpMock).toHaveBeenCalledWith('foo', 'bar');
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
         decodeWebpMock.mockRejectedValue('error');
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
