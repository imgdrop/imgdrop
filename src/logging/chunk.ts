// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import * as sentry from '@sentry/browser';

sentry.init({
   dsn: 'https://beafc8be05034d0485b513b01526ed3d@o379971.ingest.sentry.io/5205341',
});

export { sentry };
