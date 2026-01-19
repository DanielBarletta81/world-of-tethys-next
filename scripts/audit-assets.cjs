#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(repoRoot, 'src');
const publicRoot = path.join(repoRoot, 'public');

const ASSET_PREFIXES = [
  '/img/',
  '/audio/',
  '/sfx/',
  '/symbols/',
  '/noise.svg',
  '/forest-2107470.jpg'
];

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function extractAssetPaths(text) {
  const results = new Set();
  const regex = /(?:cdn\(|['"`])\s*(\/[^'"`)\s]+)\s*(?:\)|['"`])/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const candidate = match[1];
    if (!candidate || candidate.startsWith('http') || candidate.startsWith('data:')) continue;
    if (ASSET_PREFIXES.some(prefix => candidate.startsWith(prefix))) {
      results.add(candidate);
    }
  }
  return results;
}

function main() {
  const files = walk(srcRoot);
  const assets = new Set();

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.jsx') && !file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.css')) {
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    for (const asset of extractAssetPaths(text)) {
      assets.add(asset);
    }
  }

  const missing = [];
  for (const asset of assets) {
    const diskPath = path.join(publicRoot, asset);
    if (!fs.existsSync(diskPath)) {
      missing.push(asset);
    }
  }

  missing.sort();
  console.log(`Scanned ${files.length} files.`);
  console.log(`Found ${assets.size} asset references.`);
  console.log(`Missing ${missing.length} assets.`);
  if (missing.length) {
    console.log('\nMissing assets:');
    for (const item of missing) {
      console.log(`- ${item}`);
    }
  }
}

main();
