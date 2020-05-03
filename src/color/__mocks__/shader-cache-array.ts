export interface ShaderCacheMock {
   meta: string;
   begin: jest.Mock;
   uploadTexture: jest.Mock;
   uploadOptionalTexture: jest.Mock;
   end: jest.Mock;
}

export const shaderMocks: ShaderCacheMock[] = [];
