// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

beforeEach(() => {
   jest.resetModules();
});

it('initializes sentry', async () => {
   const sentry = await import('@sentry/browser');
   const sentryInitSpy = jest.spyOn(sentry, 'init');
   const chunk = await import('./chunk');
   expect(chunk.sentry).toMatchObject(sentry);
   expect(sentryInitSpy).toHaveBeenCalledWith({
      dsn: expect.any(String),
   });
});
