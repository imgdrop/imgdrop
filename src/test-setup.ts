// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
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
