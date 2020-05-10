// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

const chunkPromise = import(/* webpackChunkName: 'logging' */ './chunk');

export async function logError(error: Error): Promise<void> {
   console.error(error);
   const chunk = await chunkPromise;
   chunk.sentry.captureException(error);
}
