export default function robots() {
  const baseUrl = 'https://cargo.portsai.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
