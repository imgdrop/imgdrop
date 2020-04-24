import { decodeHTMLImage } from './html';

export function decodeImage(file: File): Promise<HTMLCanvasElement> {
   return decodeHTMLImage(file);
}
