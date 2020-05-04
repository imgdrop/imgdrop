const chunkPromise = import(/* webpackChunkName: 'logging' */ './chunk');

export async function logError(error: Error): Promise<void> {
   console.error(error);
   const chunk = await chunkPromise;
   chunk.sentry.captureException(error);
}
