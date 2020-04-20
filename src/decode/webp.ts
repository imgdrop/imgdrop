import { decodeWithWasm } from '../../wasm';
import js from '../../wasm/webp/webp';
import wasm from '../../wasm/webp/webp.wasm';

export async function decodeWithWebp(file: File): Promise<ImageData> {
   console.log('Trying WebP decoder...');
   return await decodeWithWasm(file, js, wasm);
}
