import { decodeWithWasm } from '../../wasm';
import js from '../../wasm/raw/raw';
import wasm from '../../wasm/raw/raw.wasm';

export async function decodeWithRaw(file: File): Promise<ImageData> {
   return await decodeWithWasm(file, js, wasm);
}
