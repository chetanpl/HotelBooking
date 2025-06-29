import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isStaticExport = process.env.NEXT_EXPORT === 'true';

export default withNextIntl({
  experimental: isStaticExport ? {} : { serverActions: {} }
});
