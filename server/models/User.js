import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  company: {
    type: String,
    trim: true
  },
  room: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  vehicles: [{
    number: { type: String, required: true },
    model: { type: String, required: true }
  }],
  accessCardId: {
    type: String,
    trim: true
  },
  employeeId: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String // Base64 or URL
  }
});

export default mongoose.model('User', userSchema);
