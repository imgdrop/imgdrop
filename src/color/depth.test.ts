import { rescaleDepth } from './depth';

describe(rescaleDepth, () => {
   it('copies the input data if its bitdepth is 8', () => {
      const output = new Uint8Array(5);
      rescaleDepth(8, [1, 2, 3, 4, 5], output);
      expect(output).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
   });

   it('downscales the input data if its bitdepth is larger than 8', () => {
      const output = new Uint8Array(3);
      rescaleDepth(16, [0x0000, 0xffff, 0x7fff], output);
      expect(output).toEqual(new Uint8Array([0x00, 0xff, 0x7f]));
   });

   it('upscales the input if its bitdepth is less than 8', () => {
      const output = new Uint8Array(3);
      rescaleDepth(4, [0x0, 0xf, 0x7], output);
      expect(output).toEqual(new Uint8Array([0x00, 0xff, 0x77]));
   });

   it('works with a bitdepth of 1', () => {
      const output = new Uint8Array(2);
      rescaleDepth(1, [0, 1], output);
      expect(output).toEqual(new Uint8Array([0x00, 0xff]));
   });
});
