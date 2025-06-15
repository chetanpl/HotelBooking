import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale || 'en'; // ✅ fallback

  return {
    locale: resolvedLocale,
    messages: (await import(`../locales/${resolvedLocale}.json`)).default
  };
});
