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
