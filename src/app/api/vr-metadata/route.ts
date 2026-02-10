import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

// Protect the ingest endpoint with a shared token (set VR_METADATA_TOKEN in env).
const AUTH_TOKEN = process.env.VR_METADATA_TOKEN;

function validateRecord(record: any) {
  const errors: string[] = [];
  if (!record || typeof record !== 'object') {
    return { ok: false, errors: ['Payload must be an object'] };
  }

  const {
    assetId,
    version = '1.0.0',
    title,
    uri,
    format,
    sizeBytes,
    checksum,
    tags,
    source,
    dimensions,
    published = false
  } = record;

  if (!assetId || typeof assetId !== 'string') errors.push('assetId (string) is required');
  if (version && typeof version !== 'string') errors.push('version must be a string');
  if (!title || typeof title !== 'string') errors.push('title (string) is required');
  if (!uri || typeof uri !== 'string') errors.push('uri (string) is required');
  if (format && typeof format !== 'string') errors.push('format must be a string');
  if (sizeBytes && typeof sizeBytes !== 'number') errors.push('sizeBytes must be a number');
  if (checksum && typeof checksum !== 'string') errors.push('checksum must be a string');
  if (tags && !Array.isArray(tags)) errors.push('tags must be an array of strings');
  if (source && typeof source !== 'string') errors.push('source must be a string');
  if (dimensions) {
    const dims = dimensions as Record<string, any>;
    ['width', 'height', 'depth'].forEach((k) => {
      if (dims[k] !== undefined && typeof dims[k] !== 'number') {
        errors.push(`dimensions.${k} must be a number`);
      }
    });
  }
  if (typeof published !== 'boolean') errors.push('published must be a boolean');

  return { ok: errors.length === 0, errors };
}

async function upsertRecord(record: any, firebase: { db: any; bucket: any }) {
  const version = record.version || '1.0.0';
  const key = `${record.assetId}:${version}`;
  const payload = {
    ...record,
    version,
    updatedAt: new Date().toISOString()
  };

  await firebase.db.collection('vrMetadata').doc(key).set(payload, { merge: true });

  let storagePath: string | null = null;
  if (firebase.bucket) {
    storagePath = `vr-metadata/${record.assetId}/${version}.json`;
    await firebase.bucket.file(storagePath).save(JSON.stringify(payload, null, 2), {
      contentType: 'application/json'
    });
  }

  return { key, storagePath };
}

export async function POST(request: Request) {
  const token = request.headers.get('x-vr-token') || request.headers.get('authorization');
  if (!AUTH_TOKEN || token !== AUTH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const firebaseResult = (() => {
    try {
      return getFirebaseAdmin();
    } catch (err: any) {
      return { error: err?.message || 'Firebase admin init failed' };
    }
  })();

  if ('error' in firebaseResult) {
    return NextResponse.json({ error: firebaseResult.error }, { status: 500 });
  }
  const firebase = firebaseResult;

  const records = Array.isArray(payload) ? payload : [payload];

  const results = await Promise.all(
    records.map(async (record) => {
      const validation = validateRecord(record);
      if (!validation.ok) {
        return { status: 'rejected', errors: validation.errors, record };
      }
      try {
        const upserted = await upsertRecord(record, firebase);
        return { status: 'upserted', key: upserted.key, storagePath: upserted.storagePath };
      } catch (err: any) {
        return { status: 'error', error: err?.message || 'DB write failed', record };
      }
    })
  );

  const rejected = results.filter((r) => r.status === 'rejected' || r.status === 'error');
  const httpStatus = rejected.length === results.length ? 400 : 201;

  return NextResponse.json(
    {
      message: 'VR metadata ingest processed',
      results,
      storage: firebase.bucket ? 'firebase storage + firestore' : 'firestore'
    },
    { status: httpStatus }
  );
}
// World of Tethys || D.C. Barletta
