import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['점검', '안전', '행사', '일반', '공지'], 
    default: '일반'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: '관리사무소'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Notice', noticeSchema);
