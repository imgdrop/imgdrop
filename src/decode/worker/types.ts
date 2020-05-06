// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as heif from './heif';
import * as jp2 from './jp2';
import * as raw from './raw';
import * as tiff from './tiff';
import * as webp from './webp';
import * as pnm from './pnm';

export const workerExports = {
   ...webp,
   ...tiff,
   ...jp2,
   ...heif,
   ...pnm,
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
