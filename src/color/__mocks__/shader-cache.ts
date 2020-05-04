import { shaderMocks } from './shader-cache-array';

export class ShaderCache {
   begin = jest.fn();

   uploadTexture = jest.fn();

   uploadOptionalTexture = jest.fn();

   end = jest.fn();

   constructor(public meta: string) {
      shaderMocks.push(this);
   }
}
