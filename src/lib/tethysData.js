// src/lib/tethysData.js
// Note: Removed 'use client' so this can be used in Server Components for caching/SEO

import {cdn} from './cdn';

// Updated to match your Vercel Environment Variable
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? 'https://cms.dcbarletta.com/wp-json/wp/v2';

export async function getTethysData(endpoint = 'posts', params = {}) {
  const query = new URLSearchParams({
    _embed: 'true',
    per_page: '100',
    ...params,
  });

  try {
    const res = await fetch(`${API_URL}/${endpoint}?${query.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // This caching strategy works best when called from Server Components
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(`Fetch error for ${endpoint}:`, e);
    return [];
  }
}

// === HELPER: MAP CREATURES ===
export async function getCleanCreatures() {
  const raw = await getTethysData('creature');
  return raw.map(item => ({
    id: item.id,
    name: item.title.rendered,
    blurb: item.acf?.blurb || 'Data pending...',
    image:
      item.acf?.creature_image ||
      item._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      cdn('/img/placeholder.jpg'),
    status: item.acf?.danger_level || 'Unknown'
  }));
}

// === HELPER: MAP CHARACTERS ===
export async function getCleanCharacters() {
  const raw = await getTethysData('character');
  return raw.map(item => ({
    id: item.id,
    name: item.title.rendered,
    role: item.acf?.role || 'Wanderer',
    archetype: item.acf?.archetype || 'Unknown',
    faction: item.acf?.faction_allegiance || 'Unaligned',
    sigil: item.acf?.sigil_image || cdn('/img/icons/tethys-seal.svg')
  }));
}