export default {
   soureCode: 'source(code)',
   uniforms: new Proxy({}, {
      get(key): { variableName: string } {
         return {
            variableName: `min_${key}`
         };
      }
   })
};
