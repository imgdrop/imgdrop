import { decodeImage } from './decode';
import { encodeImage } from './encode';
import { monitorAction } from './monitor';
import { fileExtension, fileBasename } from './util';

export async function convertImage(file: File): Promise<void> {
   let image: ImageData;
   try {
      image = await monitorAction(() => decodeImage(file), 'decode', {
         extension: fileExtension(file.name)
      });
   } catch {
      alert('Failed to read image');
      return;
   }

   let output: Blob;
   try {
      output = await monitorAction(() => encodeImage(image), 'encode');
   } catch {
      alert('Failed to encode image');
      return;
   }

   const link = document.createElement('a');
   link.download = `${fileBasename(file.name)}.png`;
   link.href = URL.createObjectURL(output);
   link.click();
   URL.revokeObjectURL(link.href);
}

export async function convertAllImages(files: FileList): Promise<void> {
   await Promise.all(Array.from(files).map(file => convertImage(file)));
}
