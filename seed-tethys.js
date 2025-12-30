/* eslint-disable no-console */
// Seed WordPress with sample archival_post entries.
// Run with: node seed-tethys.js
// Requires env: NEXT_PUBLIC_WP_URL (domain only), WP_USER, WP_APP_PASS

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const baseUrl = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');
const wpUser = process.env.WP_USER;
const wpPass = process.env.WP_APP_PASS;

if (!baseUrl || !wpUser || !wpPass) {
  console.error('Missing env vars. Ensure NEXT_PUBLIC_WP_URL, WP_USER, and WP_APP_PASS are set in .env.local');
  process.exit(1);
}

const auth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
const endpoint = `${baseUrl}/wp-json/wp/v2/archival_post`;

const samplePosts = [
  { title: 'The Ironwoods Rift', x: 72.4, y: 15.8, primary: 'geology', secondary: 'creature', content: 'Massive petrified trunks split by tectonic pressure. Home to the Obsidian Shard.' },
  { title: 'Silt-Drowned Spires', x: 45.1, y: 88.2, primary: 'geography', secondary: 'lore', content: 'Ruins of a pre-Cambrian settlement currently submerged in the Southern Current.' },
  { title: 'The Archivist’s Perch', x: 5.0, y: 5.0, primary: 'lore', secondary: 'human', content: 'The original monitoring station for the 2025 VR Handshake.' },
  { title: 'Watcher’s Ashfall', x: 22.3, y: 34.2, primary: 'geology', secondary: 'lore', content: 'A basalt shelf coated in volcanic glass, humming with low resonance.' },
  { title: 'Silurian Shallows', x: 52.0, y: 62.5, primary: 'creature', secondary: 'human', content: 'High-oxygen shallows where Vestigial Gills first emerged.' },
  { title: 'Aethel Canopy', x: 35.5, y: 40.4, primary: 'lore', secondary: 'creature', content: 'Bioluminescent silk harvest grounds tended by Sky-Humans.' },
  { title: 'Bone Shelf Verge', x: 50.0, y: 55.0, primary: 'geography', secondary: 'geology', content: 'Calcified terrace forming the bridge between spires and deep ocean.' },
  { title: 'Purgess Scar', x: 38.0, y: 65.0, primary: 'geology', secondary: 'resilience', content: 'Radiant basalt wastes marked by boiling mineral springs.' },
  { title: 'Gargantua Beacon', x: 90.0, y: 90.0, primary: 'creature', secondary: 'geology', content: 'SE rift tower signaling the spawning grounds of titans.' },
  { title: 'Cambria Lens', x: 65.0, y: 40.0, primary: 'lore', secondary: 'geography', content: 'An ancient observatory that aligns Thuban with the submerged city.' }
];

async function seed() {
  console.log('🚀 Seeding Tethys archival posts...');

  for (const post of samplePosts) {
    const payload = {
      title: post.title,
      content: post.content,
      status: 'publish',
      acf: {
        map_coords: { map_x: post.x, map_y: post.y },
        genetic_weights: { primary_weight: post.primary, secondary_weight: post.secondary },
        technical_triggers: JSON.stringify({ unlock: 'discovery_bonus', sound: 'wind_loop' })
      }
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed: ${post.title} (${res.status})`, err);
        continue;
      }

      console.log(`✅ Created: ${post.title}`);
    } catch (error) {
      console.error(`❌ Failed: ${post.title}`, error?.message || error);
    }
  }

  console.log('✨ Seed complete.');
}

seed();
