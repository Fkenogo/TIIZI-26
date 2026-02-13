import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const admin = require('../functions/node_modules/firebase-admin');

function getArg(name, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === `--${name}`);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function hasBaseFields(doc) {
  return !!doc
    && typeof doc.id === 'string'
    && typeof doc.name === 'string'
    && typeof doc.category === 'string'
    && typeof doc.subcategory === 'string'
    && typeof doc.difficultyScore === 'number'
    && typeof doc.estimatedCaloriesPerMinute === 'number'
    && typeof doc.badges === 'object'
    && typeof doc.streakBadges === 'object'
    && typeof doc.leaderboardMetrics === 'object'
    && typeof doc.challengeLevel === 'string'
    && typeof doc.xpReward === 'number'
    && typeof doc.eligibleForChallenges === 'boolean'
    && isStringArray(doc.challengeTags);
}

function isMovementExercise(doc) {
  return hasBaseFields(doc)
    && typeof doc.setup === 'string'
    && typeof doc.execution === 'string'
    && isStringArray(doc.formCues)
    && isStringArray(doc.commonMistakes)
    && isStringArray(doc.musclesWorked)
    && typeof doc.progression === 'string'
    && typeof doc.regression === 'string';
}

function isWellnessExercise(doc) {
  return hasBaseFields(doc)
    && typeof doc.description === 'string'
    && isStringArray(doc.trackingFields);
}

function validatePayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    errors.push('Root payload must be an object.');
    return errors;
  }
  if (!Array.isArray(payload.exercises)) {
    errors.push('`exercises` must be an array.');
  } else {
    payload.exercises.forEach((exercise, index) => {
      if (!isMovementExercise(exercise) && !isWellnessExercise(exercise)) {
        errors.push(`Invalid exercise at index ${index} (${exercise?.id || 'unknown id'}).`);
      }
    });
  }
  if (!payload.systemConfig || typeof payload.systemConfig !== 'object') {
    errors.push('`systemConfig` must be an object.');
  }
  return errors;
}

async function writeInChunks(refsAndData) {
  const chunkSize = 400;
  for (let i = 0; i < refsAndData.length; i += chunkSize) {
    const batch = admin.firestore().batch();
    refsAndData.slice(i, i + chunkSize).forEach(({ ref, data }) => {
      batch.set(ref, data, { merge: false });
    });
    await batch.commit();
  }
}

async function main() {
  const fileArg = getArg('file');
  if (!fileArg) {
    console.error('Missing --file argument.\nExample: npm run seed:exercise-engine -- --file "/path/to/file.json"');
    process.exit(1);
  }

  const projectId = getArg('project', process.env.VITE_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'tiizi-235d4');
  const replace = getArg('replace', 'true') !== 'false';
  const sourcePath = path.resolve(fileArg);
  const raw = await fs.readFile(sourcePath, 'utf8');
  const payload = JSON.parse(raw);
  const errors = validatePayload(payload);
  if (errors.length > 0) {
    console.error('Validation failed:\n' + errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
  }

  admin.initializeApp({ projectId });
  const db = admin.firestore();

  const exercisesCol = db.collection('exercises');
  if (replace) {
    const existing = await exercisesCol.listDocuments();
    if (existing.length > 0) {
      for (const ref of existing) {
        await ref.delete().catch(() => undefined);
      }
    }
  }

  await writeInChunks(
    payload.exercises.map((exercise) => ({
      ref: exercisesCol.doc(exercise.id),
      data: {
        ...exercise,
        seededAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    }))
  );

  const systemConfig = {
    ...payload.systemConfig,
    mvpFlags: {
      paywallEnabled: false,
      monetizationUiEnabled: false,
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('systemConfig').doc('global').set(systemConfig, { merge: true });

  const movementCount = payload.exercises.filter((exercise) => 'setup' in exercise).length;
  const wellnessCount = payload.exercises.filter((exercise) => 'trackingFields' in exercise).length;
  console.log(`Seed complete for project ${projectId}`);
  console.log(`- exercises: ${payload.exercises.length} (movement: ${movementCount}, wellness: ${wellnessCount})`);
  console.log('- systemConfig/global: upserted');
  console.log('- paywall flags: disabled for MVP');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
