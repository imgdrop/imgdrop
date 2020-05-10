// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { loadWasmModule } from './wasm';

describe(loadWasmModule, () => {
   let moduleMock: {
      then?: string;
      mountFile: jest.Mock;
   };
   let factoryMock: jest.Mock;

   beforeEach(() => {
      moduleMock = {
         then: 'then',
         mountFile: jest.fn(),
      };
      factoryMock = jest.fn();
      factoryMock.mockReturnValue(moduleMock);
   });

   it('loads the wasm module', async () => {
      const promise = loadWasmModule(factoryMock, 'wasm/path' as any, 'file' as any);
      expect(factoryMock).toHaveBeenCalledWith({
         memory: expect.any(WebAssembly.Memory),
         locateFile: expect.any(Function),
         onRuntimeInitialized: expect.any(Function),
      });

      factoryMock.mock.calls[0][0].onRuntimeInitialized();
      await expect(promise).resolves.toBe(moduleMock);
      expect(moduleMock.then).toBeUndefined();
      expect(moduleMock.mountFile).toHaveBeenCalledWith('file');
   });

   describe('memory', () => {
      it('caches the WebAssembly memory', () => {
         loadWasmModule(factoryMock, 'wasm/path' as any, 'file' as any);
         loadWasmModule(factoryMock, 'wasm/path' as any, 'file' as any);
         expect(factoryMock.mock.calls[0][0].memory).toBe(
            factoryMock.mock.calls[1][0].memory
         );
      });
   });

   describe('locateFile', () => {
      let locateFile: Function;

      beforeEach(() => {
         loadWasmModule(factoryMock, 'wasm/path' as any, 'file' as any);
         locateFile = factoryMock.mock.calls[0][0].locateFile;
      });

      it('returns the wasm path when the path ends in .wasm', () => {
         expect(locateFile('index.wasm', 'prefix/')).toBe('wasm/path');
      });

      it('combines the prefix and path if it does not know the file', () => {
         expect(locateFile('index.js', 'prefix/')).toBe('prefix/index.js');
      });
   });
});
