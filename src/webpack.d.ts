declare module '*.wasm' {
   const wasm: string;
   export default wasm;
}

declare module '*.glsl' {
   const glsl: {
      sourceCode: string;
      uniforms: {
         [key: string]: {
            variableName: string;
         };
      };
   };
   export default glsl;
}
