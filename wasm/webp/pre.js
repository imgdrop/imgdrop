Module.locateFile = (path, prefix) => {
   if (path.endsWith('.wasm')) {
      return require('./index.wasm').default;
   } else {
      return `${path}${prefix}`;
   }
};

Module.promise = new Promise(resolve => Module.onRuntimeInitialized = () => {
   Module.webpAllocate = Module.cwrap('webpAllocate', 'number', ['number']);
   Module.webpDecode = Module.cwrap('webpDecode', 'number', ['number', 'number', 'number']);
   Module.webpWidth = Module.cwrap('webpWidth', 'number', []);
   Module.webpHeight = Module.cwrap('webpHeight', 'number', []);
   resolve();
});
