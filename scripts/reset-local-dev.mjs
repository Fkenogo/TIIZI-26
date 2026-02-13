import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const cwd = process.cwd();
const firebasercPath = path.join(cwd, '.firebaserc');

async function getProjectId() {
  const envProject =
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT;
  if (envProject) return envProject;

  try {
    const raw = await fs.readFile(firebasercPath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed?.projects?.default || 'demo-tiizi';
  } catch {
    return 'demo-tiizi';
  }
}

async function clearDir(relPath) {
  const target = path.join(cwd, relPath);
  try {
    await fs.rm(target, { recursive: true, force: true });
    await fs.mkdir(target, { recursive: true });
    return { target: relPath, cleared: true };
  } catch (error) {
    return { target: relPath, cleared: false, error: String(error) };
  }
}

async function deleteEndpoint(url) {
  try {
    const response = await fetch(url, { method: 'DELETE' });
    return { url, ok: response.ok, status: response.status };
  } catch (error) {
    return { url, ok: false, status: 0, error: String(error) };
  }
}

async function run() {
  const projectId = await getProjectId();
  console.log(`Resetting local state for project: ${projectId}`);

  const firestoreResult = await deleteEndpoint(
    `http://127.0.0.1:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`
  );
  const authResult = await deleteEndpoint(
    `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts`
  );

  const clearedDirs = await Promise.all([
    clearDir('dataconnect/.dataconnect/pgliteData'),
    clearDir('.firebase/logs'),
    clearDir('reports'),
  ]);

  console.log('\nBackend wipe status:');
  console.log(`- Firestore emulator: ${firestoreResult.ok ? 'cleared' : `skipped (${firestoreResult.status || 'offline'})`}`);
  console.log(`- Auth emulator: ${authResult.ok ? 'cleared' : `skipped (${authResult.status || 'offline'})`}`);

  console.log('\nFilesystem cleanup status:');
  for (const entry of clearedDirs) {
    console.log(`- ${entry.target}: ${entry.cleared ? 'cleared' : `failed (${entry.error})`}`);
  }

  console.log('\nFrontend note: browser localStorage/sessionStorage will be cleared on app load when VITE_RESET_ON_LOAD=true.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
