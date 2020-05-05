import * as heif from './heif';
import * as jp2 from './jp2';
import * as raw from './raw';
import * as tiff from './tiff';
import * as webp from './webp';

export const workerExports = {
   ...webp,
   ...tiff,
   ...jp2,
   ...heif,
   ...raw,
};

export type WorkerExports = typeof workerExports;

type PromiseReturn<P> = P extends PromiseLike<infer T> ? T : P;
export type WorkerReturn<E extends keyof WorkerExports> = PromiseReturn<
   ReturnType<WorkerExports[E]>
>;

export interface WorkerMessage<E extends keyof WorkerExports> {
   name: E;
   args: Parameters<WorkerExports[E]>;
}
