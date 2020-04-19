const chunkPromise = import(/* webpackChunkName: 'monitor' */ './chunk');

async function actionResolve(name: string, startTime: number, info?: Record<string, string>): Promise<void> {
   const duration = performance.now() - startTime;
   const chunk = await chunkPromise;
   const trace = chunk.performance.trace(`${name}_performance`);
   trace.record(startTime, duration, {
      attributes: info
   });
}

async function actionReject(name: string, error: any, info?: Record<string, string>): Promise<void> {
   const chunk = await chunkPromise;
   chunk.analytics.logEvent(`${name}_rejected`, {
      ...info,
      error: error
   });
   chunk.sentry.captureException(error);
   console.error(error);
}

export async function monitorAction<T>(action: () => Promise<T>, name: string, info?: Record<string, string>): Promise<T> {
   const startTime = performance.now();
   for (const key in info) {
      console.log(`${key}: ${info[key]}`);
   }

   try {
      const result = await action();
      actionResolve(name, startTime, info);
      return result;
   } catch (error) {
      actionReject(name, error, info);
      throw error;
   }
}
