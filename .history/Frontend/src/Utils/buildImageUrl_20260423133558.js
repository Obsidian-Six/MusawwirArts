// Shared helper to normalize image URLs across the frontend
export default function buildImageUrl(imageUrl) {
  const PLACEHOLDER = '/placeholder-banner.jpg';
  if (!imageUrl) return PLACEHOLDER;

  const s = String(imageUrl).trim();
  // If already an absolute URL or data/blob, return it
  if (/^(https?:)?\/\//i.test(s) || /^data:|^blob:/i.test(s)) return s;

  // Choose a base: prefer VITE_BASE_URL when it contains an origin, otherwise fallback to window.location.origin
  const rawBase = import.meta.env.VITE_BASE_URL || '';
  let base = rawBase ? String(rawBase).replace(/\/$/, '') : '';
  // Remove trailing '/api' if present to avoid generating URLs like '.../api/uploads/...'
  base = base.replace(/\/api\/?$/i, '');
  if (!/^https?:\/\//i.test(base)) {
    // If base looks like just a path (like '/app/'), ignore it and use origin
    base = window.location.origin;
  }

  // If the path already contains '/uploads', use that segment
  const uploadsIndex = s.indexOf('/uploads');
  let path = '';
  if (uploadsIndex !== -1) {
    path = s.slice(uploadsIndex);
  } else if (s.startsWith('/')) {
    path = s;
  } else {
    // If the incoming value is 'uploads/...' or just a filename, ensure it becomes '/uploads/...'
    if (/^uploads\//i.test(s)) path = '/' + s;
    else path = '/uploads/' + s.replace(/^\/+/, '');
  }

  // Normalize duplicate slashes
  const normalized = path.replace(/\/+/g, '/');
  // If the path is a site-root uploads path, return it root-relative so the
  // frontend (Vite / public) serves it rather than forcing the backend origin.
  if (normalized.startsWith('/uploads')) return normalized;

  return base.replace(/\/$/, '') + normalized;
}
