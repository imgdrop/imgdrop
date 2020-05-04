export function getPathExtension(path: string): string {
   const dotIndex = path.lastIndexOf('.');
   if (dotIndex === -1) {
      return '';
   }
   return path.substr(dotIndex + 1).toLowerCase();
}

export function getPathBasename(path: string): string {
   const dotIndex = path.lastIndexOf('.');
   if (dotIndex === -1) {
      return path;
   }
   return path.substr(0, dotIndex);
}
