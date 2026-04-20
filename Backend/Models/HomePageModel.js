import mongoose from 'mongoose';

const HomepageSchema = new mongoose.Schema({
  // CHANGE THIS: Wrap the object in [ ] to make it an array
  banners: [{
    type: { 
      type: String, 
      enum: ['image', 'video'], 
      default: 'image' 
    },
    url: String,
    filename: String,
    title: String,
    subtitle: String,
    ctaText: String,
    ctaLink: String
  }],
  sections: [{
    id: String,
    label: String,
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  }],
  seo: {
    metaTitle: String,
    metaDescription: String
  }
}, { timestamps: true });

const Homepage = mongoose.model('Homepage', HomepageSchema);
export default Homepage;