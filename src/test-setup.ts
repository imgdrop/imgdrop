/* eslint-disable class-methods-use-this */

URL.createObjectURL = (): string => '';
URL.revokeObjectURL = (): void => {};

window.Worker = class {
   postMessage(): void {}
} as any;

window.onmessage = (): void => {};
