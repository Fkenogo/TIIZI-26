import fs from 'fs';
import path from 'path';
import process from 'process';
import { createRequire } from 'node:module';

const yesFlag = process.argv.includes('--yes') || process.env.WIPE_CONFIRM === 'YES';
if (!yesFlag) {
  console.error('Refusing to wipe Auth users. Re-run with --yes or set WIPE_CONFIRM=YES.');
  process.exit(1);
}

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.argv.find((arg) => arg.endsWith('.json'));
if (!serviceAccountPath) {
  console.error('Missing service account JSON. Set GOOGLE_APPLICATION_CREDENTIALS or pass path to the JSON.');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const admin = require('../functions/node_modules/firebase-admin');

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountPath), 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

async function deleteBatch(nextPageToken) {
  const result = await auth.listUsers(1000, nextPageToken);
  if (result.users.length === 0) return;
  await auth.deleteUsers(result.users.map((u) => u.uid));
  if (result.pageToken) {
    await deleteBatch(result.pageToken);
  }
}

async function run() {
  await deleteBatch();
  console.log('Auth users wipe complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
