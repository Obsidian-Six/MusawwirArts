import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  description: { 
    type: String 
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  },
  bannerImage: { 
    type: String 
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category; // Use this instead of module.exports