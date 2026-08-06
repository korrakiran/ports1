export default function robots() {
  const baseUrl = 'https://cargo.portsai.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account', '/processing']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
