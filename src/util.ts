export function changeExtension(file: string, ext: string): string {
   return `${file.replace(/\.[^.]*$/, '')}.${ext}`;
}

export function readBlob(file: Blob): Promise<ArrayBuffer> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
   });
}

export function createContext(width: number, height: number): CanvasRenderingContext2D {
   const canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;

   const ctx = canvas.getContext('2d');
   if (ctx === null) {
      throw new Error('Failed to create 2D context');
   }
   return ctx;
}

export function createImageData(width: number, height: number): ImageData {
   try {
      return new ImageData(width, height);
   } catch (error) {
      console.warn(error);
   }
   return createContext(1, 1).createImageData(width, height);
}
