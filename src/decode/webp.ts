import { readFile, createImageData } from '../util';
import { decodeWithWasm } from '../../wasm';
import js from '../../wasm/webp/webp';
import wasm from '../../wasm/webp/webp.wasm';

export async function decodeWithWebp(file: File): Promise<ImageData> {
   return await decodeWithWasm(file, js, wasm);
}
