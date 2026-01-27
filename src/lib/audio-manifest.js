import cdn from '@/lib/cdn';

export const AUDIO_TRACKS = [
  {
    id: 'intro_drone',
    title: 'Magma Forge Drone',
    artist: 'Pteros Field Bade',
    src: cdn('/sfx/intro_drone.mp3'),
    type: 'Ambience'
  },
  {
    id: 'ambience_volcanic',
    title: 'Magma Chamber Rumble',
    artist: 'Watcher Mountain Sensor',
    src: cdn('/sfx/rumble_volcano.mp3'),
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
    src: cdn('/audio/roar_scare.mp3'),
    type: 'Voiceover'
  },
  {
    id: 'vo_forge_primer',
    title: 'Forge: Primer',
    artist: 'Narrator: Ravel',
    src: cdn('/audio/sharp_rise.mp3'),
    type: 'Voiceover'
  },
  {
    id: 'vo_atlas_open',
    title: 'Atlas: Unlock',
    artist: 'Narrator: Ravel',
    src: cdn('/audio/bush-rustle.mp3'),
    type: 'Voiceover'
  }
];
// World of Tethys || D.C. Barletta
