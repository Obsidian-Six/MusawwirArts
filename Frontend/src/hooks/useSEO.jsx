import { useEffect } from 'react';

const SITE_NAME = 'Musawwir Art';
const BASE_URL = 'https://musawwirart.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/translogo.png`;

/**
 * useSEO — Dynamically sets all on-page SEO tags in <head>.
 *
 * @param {object} options
 * @param {string} options.title         - Page title (50-60 chars max). Do not include site name; it's appended automatically.
 * @param {string} options.description   - Meta description (120-160 chars).
 * @param {string} options.canonical     - Full canonical URL. Defaults to current href.
 * @param {string} options.robots        - Robots directive. Default: 'index, follow'.
 * @param {string} options.ogTitle       - OG title override. Falls back to title.
 * @param {string} options.ogDescription - OG description override. Falls back to description.
 * @param {string} options.ogImage       - OG image URL. Falls back to site default.
 * @param {string} options.ogUrl         - OG URL. Falls back to canonical.
 */
const useSEO = ({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
} = {}) => {
  useEffect(() => {
    const resolvedTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const resolvedCanonical = canonical || window.location.href;
    const resolvedOgTitle = ogTitle || resolvedTitle;
    const resolvedOgDescription = ogDescription || description || '';
    const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
    const resolvedOgUrl = ogUrl || resolvedCanonical;

    // --- Title ---
    document.title = resolvedTitle;

    // Helper: get or create a <meta> tag by attribute selector
    const setMeta = (attr, value, content) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper: get or create a <link> tag
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Helper: get or create a <meta> tag with rel attribute (non-standard canonical)
    const setMetaRel = (rel, href) => {
      let el = document.querySelector(`meta[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // --- Standard Meta ---
    if (description) setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);

    // --- Canonical: both <link rel="canonical"> and <meta rel="canonical"> ---
    setLink('canonical', resolvedCanonical);
    setMetaRel('canonical', resolvedCanonical);

    // --- Open Graph ---
    setMeta('property', 'og:title', resolvedOgTitle);
    setMeta('property', 'og:description', resolvedOgDescription);
    setMeta('property', 'og:image', resolvedOgImage);
    setMeta('property', 'og:url', resolvedOgUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);

    // --- Twitter Card ---
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', resolvedOgTitle);
    setMeta('name', 'twitter:description', resolvedOgDescription);
    setMeta('name', 'twitter:image', resolvedOgImage);
  }, [title, description, canonical, robots, ogTitle, ogDescription, ogImage, ogUrl]);
};

export default useSEO;
