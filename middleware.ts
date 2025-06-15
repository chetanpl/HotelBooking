// import createMiddleware from 'next-intl/middleware';

// export default createMiddleware({
//   locales: ['en-GB', 'de-DE'],
//   defaultLocale: 'en-GB',
// });

// export const config = {
//   matcher: ['/((?!api|static|_next|favicon.ico).*)'],
// };



import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(en|de)/:path*']
};
