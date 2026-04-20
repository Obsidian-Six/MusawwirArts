import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    default: []
  }],
  categories: [{
    type: String,
    trim: true,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  author: {
    type: String,
    default: 'Musawwir Art',
  },
  // ─── SEO Fields ────────────────────────────────────────────
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    keywords: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

// Auto-generate slug from title before saving
blogSchema.pre('save', async function () {
  if (!this.isModified('title') && this.slug) return;

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Ensure slug is unique
  while (await mongoose.model('Blog').exists({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

// Auto-set publishedAt when status changes to published
blogSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.model('Blog', blogSchema);
