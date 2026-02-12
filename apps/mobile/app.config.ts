import 'dotenv/config';

export default {
  name: 'World of Tethys',
  slug: 'world-of-tethys',
  scheme: 'tethys',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#0c0a09'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#0c0a09'
    }
  },
  extra: {
    cdnBase: process.env.EXPO_PUBLIC_CDN_BASE ?? ''
  },
  plugins: ['expo-router']
};
