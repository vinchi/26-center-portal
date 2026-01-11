import mongoose from 'mongoose';

const moveInCardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    required: true,
    trim: true
  },
  vehicleCount: {
    type: Number,
    default: 0
  },
  householdCount: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

moveInCardSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

const MoveInCard = mongoose.model('MoveInCard', moveInCardSchema);

export default MoveInCard;
