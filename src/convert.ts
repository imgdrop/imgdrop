import { decodeImage } from './decode';
import { encodeImage } from './encode';
import { changeExtension } from './util';
import { monitorAction } from './monitor';

export async function convertImage(file: File): Promise<void> {
   let image: ImageData;
   try {
      image = await monitorAction(() => decodeImage(file), 'decode', {
         mimeType: file.type
      });
   } catch (error) {
      alert('Failed to read image');
      return;
   }

   let output: Blob;
   try {
      output = await monitorAction(() => encodeImage(image), 'encode');
   } catch (error) {
      alert('Failed to encode image');
      return;
   }

   const link = document.createElement('a');
   link.download = changeExtension(file.name, 'png');
   link.href = URL.createObjectURL(output);
   link.click();
   URL.revokeObjectURL(link.href);
}

export async function convertAllImages(files: FileList): Promise<void> {
   await Promise.all(Array.from(files).map(file => convertImage(file)));
}
