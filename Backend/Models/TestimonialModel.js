import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Collector name is required"],
        trim: true 
    },
    location: { 
        type: String, 
        required: [true, "Location is required"],
        trim: true 
    },
    text: { 
        type: String, 
        required: [true, "Testimonial text is required"],
        trim: true 
    },
    stars: { 
        type: Number, 
        default: 5,
        min: 1,
        max: 5 
    },
    authorImage: { 
        type: String, 
        required: false, // Changed from true to false
        default: null
    },
    isFeatured: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);