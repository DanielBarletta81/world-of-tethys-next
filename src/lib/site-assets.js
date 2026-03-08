export const BOOK1_COVER_URL =
  process.env.NEXT_PUBLIC_BOOK1_COVER_URL ||
  'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/books/books/wotcover10.png';

export const HERO_IMAGE_URLS = {
  homepage:
    process.env.NEXT_PUBLIC_HOME_HERO_URL ||
    'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/archive_hero.PNG',
  worldHub:
    process.env.NEXT_PUBLIC_WORLD_HERO_URL ||
    'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/ChatGPT+Image+Mar+7%2C+2026%2C+07_11_10+PM.png',
  naturalHistory:
    process.env.NEXT_PUBLIC_NATURAL_HISTORY_HERO_URL ||
    'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/ailab-3eb2e92a-8813-4896-bb49-53ea8dbd8ade.png',
};

export const BACKGROUND_IMAGE_URLS = {
  homepage:
    process.env.NEXT_PUBLIC_HOME_BG_URL ||
    'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/archive_hero.PNG',
  bookPage:
    process.env.NEXT_PUBLIC_BOOK_BG_URL ||
    'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/ailab-9cad0b4d-e939-4180-b026-a683310dea83.png',
  lorePage:
    process.env.NEXT_PUBLIC_LORE_BG_URL ||
    'https://world-of-tethys-site.s3.us-east-1.amazonaws.com/img/bg/ChatGPT+Image+Mar+7%2C+2026%2C+07_11_10+PM.png',
};
