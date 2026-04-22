import mongoose from 'mongoose';

const featuredCollectionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  dimensions: { 
    type: String, 
    required: true 
  },
  medium: { 
    type: String, 
    required: true 
  },
  layoutStyle: {
    type: String,
    required: true,
    enum: ['Square (1:1)', 'Horizontal Rectangle (4:3)', 'Landscape (16:9)', 'Vertical Rectangle (3:4)', 'Portrait (9:16)'],
    default: 'Square (1:1)'
  },
  imageUrl: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.model('FeaturedCollection', featuredCollectionSchema);
