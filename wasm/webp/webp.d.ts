import { EmscriptenFactory } from '../types';

declare const webp: EmscriptenFactory<{
   _decodeWebpImage(): number;
   _getWebpWidth(): number;
   _getWebpHeight(): number;
}>;

// eslint-disable-next-line import/no-default-export
export default webp;
