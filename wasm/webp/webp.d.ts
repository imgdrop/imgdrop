import { EmscriptenFactory } from '../types';

declare const webp: EmscriptenFactory<{
   _decodeWebpImage(): number;
   _getWebpWidth(): number;
   _getWebpHeight(): number;
}>;

export default webp;
