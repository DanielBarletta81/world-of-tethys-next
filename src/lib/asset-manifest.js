// src/lib/assets-manifest.js
export const ASSET_MANIFEST = [
  {
    id: 'lore_pack_01',
    title: 'Pteros Biological Survey',
    desc: 'Full anatomy breakdowns of the Estuary Apex predators. Includes audio warnings.',
    size: '124 MB',
    format: 'PDF + MP3',
    cost: 50, // Resin Cost
    // In a real app, this would be a private S3 path. For now, put your public CloudFront URL.
    cdnUrl: 'https://d12345.cloudfront.net/lore-packs/pteros-survey-v1.zip',
    previewImage: '/img/assets/dossier-cover.jpg'
  },
  {
    id: 'wallpaper_4k_weep',
    title: 'The Weep: 4K Desktop',
    desc: 'High-resolution render of the exile falls at sunset. Magma-grade color profile.',
    size: '18 MB',
    format: 'PNG',
    cost: 25,
    cdnUrl: 'https://d12345.cloudfront.net/wallpapers/the-weep-4k.png',
    previewImage: '/img/assets/wallpaper-thumb.jpg'
  },
  {
    id: '3d_model_staff',
    title: 'Staff of the Deep: STL',
    desc: 'Printable 3D model of Igzier’s drift-staff. Supports resin printers.',
    size: '450 MB',
    format: 'STL',
    cost: 100,
    cdnUrl: 'https://d12345.cloudfront.net/models/staff-v2.stl',
    previewImage: '/img/assets/model-thumb.jpg'
  }
];
// World of Tethys || D.C. Barletta
