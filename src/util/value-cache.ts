export class ValueCache<T> {
   private cache?: T;

   get value(): T {
      if (this.cache === undefined) {
         this.cache = this.callback();
      }
      return this.cache;
   }

   constructor(private readonly callback: () => T) {}
}
