module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar'],
    localePath: './locales',
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
