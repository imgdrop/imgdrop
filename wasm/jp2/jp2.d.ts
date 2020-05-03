import { EmscriptenFactory } from '../types';

declare const jp2: EmscriptenFactory<{
   _decodeJP2Image(codec: number): number;
   _getJP2Planes(): number;
   _getJP2Data(plane: number): number;
   _getJP2Width(plane: number): number;
   _getJP2Height(plane: number): number;
   _getJP2Bitdepth(plane: number): number;
}>;

export default jp2;
