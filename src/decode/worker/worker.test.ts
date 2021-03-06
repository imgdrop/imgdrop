// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

let workerMock: {
   postMessage: jest.Mock;
   onmessage?: (event: MessageEvent) => void;
   onerror?: (event: ErrorEvent) => void;
};
let workerSpy: jest.SpyInstance;
let workerModule: any;

beforeEach(async () => {
   jest.resetModules();
   workerMock = {
      postMessage: jest.fn(),
   };
   workerSpy = jest.spyOn(window, 'Worker');
   workerSpy.mockImplementation(function Worker() {
      return workerMock;
   });
   workerModule = await import('./worker');
});

it('creates a worker on import', () => {
   expect(workerSpy).toHaveBeenCalledWith('./chunk', { type: 'module' });
});

describe('callWorker', () => {
   it('calls the worker and waits for a response', async () => {
      const promise = workerModule.callWorker('data');
      expect(workerMock.postMessage).toHaveBeenCalledWith('data');
      expect(workerMock.onmessage).toBeInstanceOf(Function);
      expect(workerMock.onerror).toBeInstanceOf(Function);

      const dataMock = {
         file: new File([], 'file'),
         buffer: new Uint8Array(),
      };
      workerMock.onmessage!({
         data: dataMock,
      } as any);
      await expect(promise).resolves.toBe(dataMock);
   });

   it('rejects if the worker throws an error', async () => {
      const promise = workerModule.callWorker('data');
      workerMock.onerror!({
         preventDefault: () => {},
         message: 'error',
      } as any);
      await expect(promise).rejects.toBeInstanceOf(Error);
   });

   it('calls prevent default on the error event', async () => {
      const promise = workerModule.callWorker('data');
      const errorMock = {
         preventDefault: jest.fn(),
         message: 'error',
      };
      workerMock.onerror!(errorMock as any);
      await expect(promise).rejects.toBeInstanceOf(Error);
      expect(errorMock.preventDefault).toHaveBeenCalledWith();
   });
});
