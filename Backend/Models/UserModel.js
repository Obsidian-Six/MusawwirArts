import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true, // Good practice for emails
    trim: true 
  }, 
  password: { type: String, required: true }       
}, {
  // This ensures Mongoose doesn't build indexes that conflict with old ones
  autoIndex: true 
});

// Hashing logic (Fixed from before)
userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model('User', userSchema);

User.syncIndexes().catch(err => console.log("Index Syncing..."));

export default User;