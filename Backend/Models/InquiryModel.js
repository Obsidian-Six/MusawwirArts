import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please include a message'],
    maxLength: [1000, 'Message cannot exceed 1000 characters']
  },
  // Link this inquiry to a specific painting
  paintingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Painting', 
    required: false // Optional, in case of general inquiries
  },
  paintingTitle: {
    type: String, // Storing title as a backup string for quick display
    required: false
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Responded', 'Archived'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

inquirySchema.index({ createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);