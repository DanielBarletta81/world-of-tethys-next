export const catalogItems = [
  {
    id: 'sky-city-kindle',
    title: 'Sky City of Tethys',
    subtitle: 'World of Tethys — Book I',
    format: 'Kindle',
    price: '$4.99',
    url: 'https://www.amazon.com/dp/B0G572X42L',
    cover: '/img/book1-cover.png',
    type: 'book',
    boost: '+12% explorer multiplier (7 days)'
  },
  {
    id: 'ravel-mystics-ebook',
    title: 'Unraveling Ravel: Stories from the Mystics',
    subtitle: '5 Ravel Tales (Side Stories)',
    format: 'E-Book',
    price: '$2.99',
    url: 'https://www.amazon.com/dp/B0GB5CR6HX',
    cover: '/img/ravel-kindle.png',
    type: 'book',
    boost: '+8% explorer multiplier (7 days)'
  },
  {
    id: 'roots-remember-kindle',
    title: 'What the Roots Remember',
    subtitle: 'Igzier & Ravel Side Story',
    format: 'Kindle',
    price: '$2.99',
    url: 'https://www.amazon.com/dp/B0G672S7YC',
    cover: '/img/roots-remember.png',
    type: 'book',
    boost: '+8% explorer multiplier (7 days)'
  },
  {
    id: 'ravel-paperback',
    title: 'Unraveling Ravel (Paperback)',
    subtitle: 'Side Stories',
    format: 'Paperback',
    price: '$7.99',
    url: 'https://www.amazon.com/dp/B0GB9D9H3Z',
    cover: '/img/ravel-paperback.png',
    type: 'book',
    boost: '+8% explorer multiplier (7 days)'
  },
  {
    id: 'sky-city-audible',
    title: 'Sky City of Tethys — Audiobook',
    subtitle: 'Exclusive on Audible/Amazon',
    format: 'Audible',
    price: '$0.00 with trial',
    url: process.env.AUDIBLE_SKYCITY_URL || 'https://www.audible.com/',
    cover: '/img/watcher-ashfall.svg',
    type: 'audio',
    boost: '+10% explorer multiplier (7 days)'
  },
  {
    id: 'author-store',
    title: 'Author Storefront',
    subtitle: 'All books by D.C. Barletta',
    format: 'Amazon',
    price: '',
    url: 'https://www.amazon.com/stores/author/B0G5LM24FM/allbooks?ingress=0&visitId=349c42e6-42bc-462d-9ce5-c016543eb9ca&ref_=aufs_ap_ahdr_dsk_aa&ccs_id=83e6c44b-5c4a-4693-8ceb-05a13dba2ff8',
    cover: '/img/book1-cover.png',
    type: 'link',
    boost: ''
  },
  // Placeholders for audio/podcast/field cards
  {
    id: 'audiobook-placeholder',
    title: 'Signals from the Archive',
    subtitle: 'Audio drops via resin unlock',
    format: 'Audio',
    price: 'Resin 50',
    url: '/signals',
    cover: '/img/watcher-ashfall.svg',
    type: 'audio',
    boost: '+10% explorer multiplier (7 days)'
  },
  {
    id: 'podcast-placeholder',
    title: 'Pteros Briefing Podcast',
    subtitle: 'Free stream + download',
    format: 'Audio',
    price: 'Free',
    url: '/broadcast',
    cover: '/img/watcher-ashfall.svg',
    type: 'podcast',
    boost: '+5% explorer multiplier (3 days)'
  },
  {
    id: 'field-cards-placeholder',
    title: 'Field Cards Pack',
    subtitle: 'Imagery + short stories',
    format: 'Download',
    price: 'Resin 35',
    url: '/archives',
    cover: '/img/watcher-ashfall.svg',
    type: 'download',
    boost: '+6% explorer multiplier (5 days)'
  }
];
