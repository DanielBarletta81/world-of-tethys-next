'use server';

const API_URL = process.env.WORDPRESS_API_URL ?? 'https://cms.dcbarletta.com/wp-json/wp/v2';

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
      next: { revalidate: 3600 }, // Cached for 1 hour
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
  const raw = await getTethysData('creature'); // Use your CPT slug
  return raw.map(item => ({
    id: item.id,
    name: item.title.rendered,
    blurb: item.acf?.blurb || 'Data pending...',
    image: item.acf?.creature_image || item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/placeholder.jpg',
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
    sigil: item.acf?.sigil_image || '/img/default-sigil.svg'
  }));
}