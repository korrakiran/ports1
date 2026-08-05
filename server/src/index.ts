import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './db/connect.js';

async function main() {
  await connectDatabase();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  console.error('[api] failed to start');
  console.error(err);
  process.exit(1);
});
