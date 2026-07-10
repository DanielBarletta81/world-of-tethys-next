import cdn from '@/lib/cdn';

export const BOOK1_COVER_URL = cdn('/img/books/book1-cover.png');

export const HERO_IMAGE_URLS = {
  homepage:
    process.env.NEXT_PUBLIC_HOME_HERO_URL ||
    cdn('/img/bg/parchment-map-table.png'),
  worldHub:
    process.env.NEXT_PUBLIC_WORLD_HERO_URL ||
    cdn('/img/bg/sky-city-hero5.png'),
  naturalHistory:
    process.env.NEXT_PUBLIC_NATURAL_HISTORY_HERO_URL ||
    cdn('/img/bg/obsidian-coast-4k.jpg'),
  floraFauna:
    process.env.NEXT_PUBLIC_FLORA_FAUNA_HERO_URL ||
    cdn('/img/bg/obsidian-coast-4k.jpg'),  // Fallback until ironwood-grove-hero.jpg uploaded
  fungi:
    process.env.NEXT_PUBLIC_FUNGI_HERO_URL ||
    cdn('/img/bg/obsidian-coast-4k.jpg'),  // Fallback until veil-spore-grove.jpg uploaded
  marineLife:
    process.env.NEXT_PUBLIC_MARINE_LIFE_HERO_URL ||
    cdn('/img/bg/glass-rays-shelf.jpg'),
  foodWeb:
    process.env.NEXT_PUBLIC_FOOD_WEB_HERO_URL ||
    cdn('/img/bg/permian-survivors.jpg'),
};

export const BACKGROUND_IMAGE_URLS = {
  homepage:
    process.env.NEXT_PUBLIC_HOME_BG_URL ||
    cdn('/img/bg/parchment-map-table.png'),
  bookPage:
    process.env.NEXT_PUBLIC_BOOK_BG_URL ||
    cdn('/img/bg/magma-forge-hero.jpg'),
  lorePage:
    process.env.NEXT_PUBLIC_LORE_BG_URL ||
    cdn('/img/bg/watcher-ptero-hero.png'),
  authorHub:
    process.env.NEXT_PUBLIC_AUTHOR_BG_URL ||
    cdn('/img/bg/magma-forge-hero.jpg'),
  worldAtlas:
    process.env.NEXT_PUBLIC_WORLD_ATLAS_BG_URL ||
    cdn('/img/bg/sky-city-hero5.png'),
};
