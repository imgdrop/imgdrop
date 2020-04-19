import { decodeImage } from './decode';
import { encodeImage } from './encode';
import { changeExtension } from './util';

export async function convertImage(file: File): Promise<void> {
   try {
      const image = await decodeImage(file);
      const output = await encodeImage(image);

      const link = document.createElement('a');
      link.download = changeExtension(file.name, 'png');
      link.href = URL.createObjectURL(output);
      link.click();
      URL.revokeObjectURL(link.href);
   } catch (error) {
      console.log(`Mime type: ${file.type}`);
      alert(error);
   }
}
