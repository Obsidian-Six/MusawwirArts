import mongoose from 'mongoose';

const paintingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  dimensions: { 
    type: String, 
    required: true 
  },
  medium: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true,
    index: true
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'published' 
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Painting', paintingSchema);