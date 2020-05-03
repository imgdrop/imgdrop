/* eslint-disable class-methods-use-this */

URL.createObjectURL = (): string => '';
URL.revokeObjectURL = (): void => {};

window.Worker = class {
   postMessage(): void {}
} as any;

window.onmessage = (): void => {};

jest.mock('./color/vertex.glsl', () => '');
jest.mock('./color/rgba.glsl', () => '');
jest.mock('./color/rgba-planar.glsl', () => '');
jest.mock('./color/gray-planar.glsl', () => '');
jest.mock('./color/yuv-planar.glsl', () => '');
