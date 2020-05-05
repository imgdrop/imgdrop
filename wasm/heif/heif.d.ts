import { EmscriptenFactory } from '../types';

declare const heif: EmscriptenFactory<{
   _decodeHeifImage(): number;
   _getHeifWidth(): number;
   _getHeifHeight(): number;
}>;

export default heif;
