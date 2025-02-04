export async function setupMws() {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_MSW === 'true'
  ) {
    if (typeof window === 'undefined') {
      const { server } = await import('./server');
      server.listen();
    } else {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const { worker } = require('./browser');
      worker.start();
    }
  }
}
