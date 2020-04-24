interface ContextMap {
   '2d': CanvasRenderingContext2D;
   webgl: WebGLRenderingContext;
}

export function createContext<T extends keyof ContextMap>(
   width: number,
   height: number,
   type: T
): ContextMap[T] {
   const canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;

   const context = canvas.getContext(type);
   if (context === null) {
      throw new Error(`Failed to create ${type.toUpperCase()} context`);
   }
   return context as ContextMap[T];
}

export function timeoutPromise(time: number): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, time));
}
