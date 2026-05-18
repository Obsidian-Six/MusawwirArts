import express from 'express';
import Painting from '../Models/PaintingModel.js';
import Sculpture from '../Models/SculptureModel.js';
import Blog from '../Models/BlogModel.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const baseUrl = 'https://musawwirart.com';

    // 1. Core Static pages
    const staticPaths = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: '/paintings', changefreq: 'daily', priority: '0.9' },
      { path: '/sculptures', changefreq: 'daily', priority: '0.9' },
      { path: '/blog', changefreq: 'weekly', priority: '0.8' },
      { path: '/aboutus', changefreq: 'monthly', priority: '0.8' },
      { path: '/artist', changefreq: 'monthly', priority: '0.8' },
      { path: '/art-maintenance', changefreq: 'monthly', priority: '0.7' },
      { path: '/faq', changefreq: 'monthly', priority: '0.7' },
      { path: '/terms', changefreq: 'yearly', priority: '0.5' },
      { path: '/copyright', changefreq: 'yearly', priority: '0.5' }
    ];

    // 2. Fetch dynamic routes from Database
    const [paintings, sculptures, blogs] = await Promise.all([
      Painting.find({ status: 'published' }).select('_id updatedAt'),
      Sculpture.find({ status: 'published' }).select('_id updatedAt'),
      Blog.find({ status: 'published' }).select('slug updatedAt')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static paths
    staticPaths.forEach(item => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${item.path}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic paintings
    paintings.forEach(painting => {
      const lastMod = painting.updatedAt ? new Date(painting.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/paintings/${painting._id}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic sculptures
    sculptures.forEach(sculpture => {
      const lastMod = sculpture.updatedAt ? new Date(sculpture.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/sculptures/${sculpture._id}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic blogs
    blogs.forEach(blog => {
      const lastMod = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

export default router;
