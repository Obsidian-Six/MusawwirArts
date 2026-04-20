// seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './UserModel.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musawwirarts');

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('YOUR_PRIVATE_SECURE_PASSWORD', 10);
  const admin = new User({
    email: 'your-official-email@art.com',
    password: hashedPassword
  });
  await admin.save();
  console.log('Admin Created Successfully');
  process.exit();
};

createAdmin();