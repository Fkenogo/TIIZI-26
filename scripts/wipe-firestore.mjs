import fs from 'fs';
import path from 'path';
import process from 'process';
import { createRequire } from 'node:module';

const yesFlag = process.argv.includes('--yes') || process.env.WIPE_CONFIRM === 'YES';
if (!yesFlag) {
  console.error('Refusing to wipe Firestore. Re-run with --yes or set WIPE_CONFIRM=YES.');
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

const db = admin.firestore();

async function run() {
  const collections = await db.listCollections();
  if (collections.length === 0) {
    console.log('No collections found. Firestore already empty.');
    return;
  }
  for (const col of collections) {
    console.log(`Deleting collection: ${col.id}`);
    await db.recursiveDelete(col);
  }
  console.log('Firestore wipe complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
