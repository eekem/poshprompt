/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://poshprompt.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    additionalSitemaps: [],
  },
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/api/*'],
  transform: async (config, path) => {
    // Custom priority for different pages
    let priority = 0.7;
    let changefreq = 'daily';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/login') || path.includes('/register')) {
      priority = 0.5;
      changefreq = 'monthly';
    } else if (path.includes('/privacy') || path.includes('/terms')) {
      priority = 0.3;
      changefreq = 'yearly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
