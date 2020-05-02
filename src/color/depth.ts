export function rescaleDepth(
   bitdepth: number,
   input: ArrayLike<number>,
   output: Uint8Array
): void {
   if (bitdepth === 8) {
      output.set(input);
      return;
   }
   for (let i = 0; i < input.length; i += 1) {
      // eslint-disable-next-line no-param-reassign, no-bitwise
      output[i] = (input[i] * 0xff) / ((1 << bitdepth) - 1);
   }
}
