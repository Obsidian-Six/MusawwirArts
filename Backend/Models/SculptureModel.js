import mongoose from 'mongoose';

const sculptureSchema = new mongoose.Schema({
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
  material: { 
    type: String, 
    required: true 
  },
  weight: { 
    type: String 
  },
  imageUrl: { 
    type: String, 
    required: true 
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

export default mongoose.model('Sculpture', sculptureSchema);
