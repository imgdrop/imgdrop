Module['mountFile'] = function(file) {
   FS.mkdir('/wfs');
   FS.mount(WORKERFS, {
      'blobs': [
         {
            'name': 'input',
            'data': file,
         },
      ],
   }, '/wfs');
}
