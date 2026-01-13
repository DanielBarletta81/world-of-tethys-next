import cdn from '@/lib/cdn';

export const AUDIO_TRACKS = [
  {
    id: 'intro_drone',
    title: 'Magma Forge Drone',
    artist: 'Pteros Field Bade',
    // Use a real URL or a placeholder mp3
    src: './public/audio/', 
    type: 'Ambience'
  },
  {
    id: 'ambience_volcanic',
    title: 'Magma Chamber Rumble',
    artist: 'Watcher Mountain Sensor',
    src: './public/audio/volcanic-rumble.mp3',
    type: 'Ambience'
  },
  {
    id: 'book1_sample',
    title: 'Book I: Chapter 1',
    artist: 'Narrator: Kith',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
    type: 'Narration'
  },
  // Voiceover cues (drop matching files in /public/audio)
  {
    id: 'vo_hatch_intro',
    title: 'Hatch: Whisper',
    artist: 'Narrator: Ravel',
    src: cdn('/audio/vo-hatch-intro.mp3'),
    type: 'Voiceover'
  },
  {
    id: 'vo_forge_primer',
    title: 'Forge: Primer',
    artist: 'Narrator: Ravel',
    src: cdn('/audio/vo-forge-primer.mp3'),
    type: 'Voiceover'
  },
  {
    id: 'vo_atlas_open',
    title: 'Atlas: Unlock',
    artist: 'Narrator: Ravel',
    src: cdn('/audio/vo-atlas-open.mp3'),
    type: 'Voiceover'
  }
];
// World of Tethys || D.C. Barletta
