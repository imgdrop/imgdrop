import { EmscriptenFactory } from '../types';

declare const heif: EmscriptenFactory<{
   _decodeHeifImage(): void;
   _getHeifColorspace(): number;
   _getHeifChroma(): number;
   _getHeifData(plane: number): number;
   _getHeifStride(plane: number): number;
   _getHeifWidth(plane: number): number;
   _getHeifHeight(plane: number): number;
}>;

export default heif;
