import { fixupData } from './fixup';

describe(fixupData, () => {
   it('copies the input into the output', () => {
      const output = new Uint8Array(4);
      fixupData(output, new Uint8Array([1, 2, 3, 4]), {
         width: 2,
         height: 2,
      });
      expect(output).toEqual(new Uint8Array([1, 2, 3, 4]));
   });

   it('supports strides larger than width', () => {
      const output = new Uint8Array(2);
      fixupData(output, new Uint8Array([1, 2, 3, 4]), {
         width: 1,
         height: 2,
         stride: 2,
      });
      expect(output).toEqual(new Uint8Array([1, 3]));
   });

   it('supports depths larger than 8', () => {
      const output = new Uint8Array(4);
      fixupData(output, new Uint16Array([0x0000, 0x7fff, 0xffff, 0x7fff]), {
         width: 2,
         height: 2,
         depth: 16,
      });
      expect(output).toEqual(new Uint8Array([0x00, 0x7f, 0xff, 0x7f]));
   });

   it('supports depths less than 8', () => {
      const output = new Uint8Array(4);
      fixupData(output, new Uint8Array([0x0, 0x7, 0xf, 0x7]), {
         width: 2,
         height: 2,
         depth: 4,
      });
      expect(output).toEqual(new Uint8Array([0x00, 0x77, 0xff, 0x77]));
   });

   it('supports a depth of 1', () => {
      const output = new Uint8Array(4);
      fixupData(output, new Uint8Array([0, 1, 1, 0]), {
         width: 2,
         height: 2,
         depth: 1,
      });
      expect(output).toEqual(new Uint8Array([0x00, 0xff, 0xff, 0x00]));
   });

   it('supports strides larger than width and non-8 depth', () => {
      const output = new Uint8Array(2);
      fixupData(output, new Uint8Array([0x0, 0x7, 0xf, 0x7]), {
         width: 1,
         height: 2,
         stride: 2,
         depth: 4,
      });
      expect(output).toEqual(new Uint8Array([0x00, 0xff]));
   });

   it('supports non-255 maxvals', () => {
      const output = new Uint8Array(4);
      fixupData(output, new Uint8Array([0, 50, 100, 50]), {
         width: 2,
         height: 2,
         maxval: 100,
      });
      expect(output).toEqual(new Uint8Array([0x00, 0x7f, 0xff, 0x7f]));
   });

   it('supports swapping 16-bit values', () => {
      const output = new Uint8Array(4);
      fixupData(output, new Uint16Array([0x0000, 0xff7f, 0xffff, 0xff7f]), {
         width: 2,
         height: 2,
         depth: 16,
         swap: true,
      });
      expect(output).toEqual(new Uint8Array([0x00, 0x7f, 0xff, 0x7f]));
   });
});
