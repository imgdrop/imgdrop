import { createContext } from '.';

describe(createContext, () => {
   let canvasMock: {
      width?: number;
      height?: number;
      getContext: jest.Mock;
   };
   let createElementSpy: jest.SpyInstance;

   beforeEach(() => {
      canvasMock = {
         getContext: jest.fn(),
      };
      createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockReturnValue(canvasMock);
   });

   it('creates a context', () => {
      canvasMock.getContext.mockReturnValue('context');
      expect(createContext(100, 200, '2d')).toBe('context');
      expect(createElementSpy).toHaveBeenCalledWith('canvas');
      expect(canvasMock.width).toBe(100);
      expect(canvasMock.height).toBe(200);
      expect(canvasMock.getContext).toHaveBeenCalledWith('2d');
   });

   it('throws if getContext returns null', () => {
      canvasMock.getContext.mockReturnValue(null);
      expect(() => createContext(100, 200, 'webgl')).toThrow(expect.any(Error));
      expect(createElementSpy).toHaveBeenCalledWith('canvas');
      expect(canvasMock.getContext).toHaveBeenCalledWith('webgl');
   });
});
