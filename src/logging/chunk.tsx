import * as sentry from '@sentry/browser';

sentry.init({
   dsn: 'https://beafc8be05034d0485b513b01526ed3d@o379971.ingest.sentry.io/5205341',
});

export { sentry };
