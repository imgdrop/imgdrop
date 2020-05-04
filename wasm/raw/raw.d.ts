import { EmscriptenFactory } from '../types';

declare const raw: EmscriptenFactory<{
   output: Uint8Array;
   _decodeRawImage(): void;
   _getRawWidth(): number;
   _getRawHeight(): number;
}>;

export default raw;
