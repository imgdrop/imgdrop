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

      workerMock.onmessage!({
         data: 'response',
      } as any);
      await expect(promise).resolves.toBe('response');
   });

   it('rejects if the worker throws an error', async () => {
      const promise = workerModule.callWorker('data');
      workerMock.onerror!({
         message: 'error',
      } as any);
      await expect(promise).rejects.toBeInstanceOf(Error);
   });
});
