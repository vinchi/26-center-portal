import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('--- Cloudtype Environment ---');
console.log('PORT:', PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Exists' : 'Missing');
console.log('RootDir:', rootDir);
console.log('---------------------------');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (!process.env.MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI is missing in environment variables!');
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      // Don't exit process, let server start so logs can be seen
    });
}

// Routes

// 1. Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, name, email, company, room, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디 또는 이메일입니다.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email,
      company,
      room,
      phone
    });

    await newUser.save();

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '존재하지 않는 사용자입니다.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, name: user.name },
      process.env.JWT_SECRET || 'secret_key_change_this_for_production',
      { expiresIn: '1d' }
    );

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        company: user.company,
        room: user.room,
        phone: user.phone,
        vehicles: user.vehicles,
        accessCardId: user.accessCardId,
        employeeId: user.employeeId,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
});

// 3. Access Card Application & Update
app.post('/api/access-card', async (req, res) => {
  try {
    // Basic Auth Check (simplified for now, ideally use middleware)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_this_for_production');
    
    // Get Data
    const { company, room, employeeId, phone, vehicles } = req.body;

    // Build update object
    const updateData = {
      company,
      room,
      employeeId,
      phone,
    };

    // If no access card exists on user, simple simulate issuing one
    const currentUser = await User.findById(decoded.id);
    if (!currentUser.accessCardId) {
      updateData.accessCardId = `2024-${Math.floor(10000 + Math.random() * 90000)}-A`;
    }

    // Add new vehicles if provided
    if (vehicles && vehicles.length > 0) {
      // In a real app, handle duplicates or replacements. Here we just push.
       updateData.$push = { vehicles: { $each: vehicles } };
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true } // Return updated doc
    );

    res.json({
      message: '신청이 완료되었습니다.',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        company: updatedUser.company,
        room: updatedUser.room,
        phone: updatedUser.phone,
        vehicles: updatedUser.vehicles,
        accessCardId: updatedUser.accessCardId,
        employeeId: updatedUser.employeeId,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
        profileImage: updatedUser.profileImage
      }
    });

  } catch (error) {
    console.error('Access Card Error:', error);
    res.status(500).json({ message: '신청 처리 중 오류가 발생했습니다.' });
  }
});

// 4. Update Profile Photo
app.post('/api/users/photo', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_this_for_production');
    const { profileImage } = req.body; // Expecting Base64 string

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { profileImage },
      { new: true }
    );

    res.json({
      message: '프로필 사진이 업데이트되었습니다.',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        company: updatedUser.company,
        room: updatedUser.room,
        phone: updatedUser.phone,
        vehicles: updatedUser.vehicles,
        accessCardId: updatedUser.accessCardId,
        employeeId: updatedUser.employeeId,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
        profileImage: updatedUser.profileImage
      }
    });

  } catch (error) {
    console.error('Photo Update Error:', error);
    res.status(500).json({ message: '사진 업데이트 중 오류가 발생했습니다.' });
  }
});

// 5. Notice Board
import Notice from './models/Notice.js';

// Get All Notices (with Pagination & Filtering)
app.get('/api/notices', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const query = {};
    if (category && category !== '전체') {
      query.type = category;
    }

    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get Notices Error:', error);
    res.status(500).json({ message: '공지사항을 불러오는 중 오류가 발생했습니다.' });
  }
});

// Get Single Notice
app.get('/api/notices/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment views
      { new: true }
    );
    if (!notice) return res.status(404).json({ message: '공지사항을 찾을 수 없습니다.' });
    res.json(notice);
  } catch (error) {
    console.error('Get Notice Error:', error);
    res.status(500).json({ message: '공지사항을 불러오는 중 오류가 발생했습니다.' });
  }
});

// Seed Mock Data
app.post('/api/notices/seed', async (req, res) => {
  try {
    await Notice.deleteMany({}); // Clear existing

    const mockNotices = [
      {
        type: '점검',
        title: '북측 윙 엘리베이터 정기 점검 안내',
        content: '<p>입주민 및 임차인 여러분, 안녕하십니까.</p><p>오는 10월 24일에 북측 윙 엘리베이터 정기 점검이 예정되어 있습니다.</p>',
        views: 1240,
        createdAt: new Date('2023-10-24')
      },
      {
        type: '안전',
        title: '연례 소방 대피 훈련 공지',
        content: '<p>안전한 26센터를 위한 연례 소방 대피 훈련이 실시됩니다.</p>',
        views: 850,
        createdAt: new Date('2023-10-20')
      },
      {
        type: '행사',
        title: '입주사 네트워킹 데이: 루프탑 테라스',
        content: '<p>입주사 간의 교류를 위한 네트워킹 데이를 개최합니다.</p>',
        views: 620,
        createdAt: new Date('2023-10-18')
      },
      {
        type: '일반',
        title: '신규 주차 관리 규정 업데이트 안내',
        content: '<p>주차 관리 효율화를 위해 규정이 일부 변경되었습니다.</p>',
        views: 2100,
        createdAt: new Date('2023-10-15')
      },
      {
        type: '점검',
        title: '중앙 냉난방 시스템 세척 작업 (5-10층)',
        content: '<p>쾌적한 환경 조성을 위해 냉난방 시스템 필터 교체 작업을 진행합니다.</p>',
        views: 430,
        createdAt: new Date('2023-10-12')
      },
      {
        type: '일반',
        title: '로비 회전문 보수 공사 일정 안내',
        content: '<p>로비 회전문 소음 문제 해결을 위한 보수 공사가 진행됩니다.</p>',
        views: 350,
        createdAt: new Date('2023-10-10')
      },
      {
        type: '행사',
        title: '가을 맞이 1층 로비 음악회 개최',
        content: '<p>점심 시간 동안 1층 로비에서 작은 음악회가 열립니다.</p>',
        views: 550,
        createdAt: new Date('2023-10-08')
      },
      {
        type: '안전',
        title: '태풍 대비 시설물 안전 점검 결과',
        content: '<p>태풍 대비 사전 점검 결과 특이사항 없음을 알려드립니다.</p>',
        views: 900,
        createdAt: new Date('2023-10-05')
      },
      {
        type: '점검',
        title: '지하 주차장 LED 조명 교체 작업',
        content: '<p>에너지 절약을 위해 지하 주차장 조명을 LED로 교체합니다.</p>',
        views: 210,
        createdAt: new Date('2023-10-01')
      },
      {
        type: '일반',
        title: '추석 연휴 기간 건물 운영 안내',
        content: '<p>추석 연휴 기간 동안 건물 출입 통제가 강화됩니다.</p>',
        views: 1500,
        createdAt: new Date('2023-09-28')
      },
      {
        type: '행사',
        title: '입주사 친선 탁구 대회 참가 신청',
        content: '<p>지하 1층 탁구장에서 입주사 친선 탁구 대회를 개최합니다.</p>',
        views: 400,
        createdAt: new Date('2023-09-25')
      },
      {
        type: '점검',
        title: '옥상 방수 공사 진행 안내',
        content: '<p>누수 예방을 위한 옥상 방수 공사가 진행될 예정입니다.</p>',
        views: 180,
        createdAt: new Date('2023-09-20')
      },
      {
        type: '안전',
        title: '심폐소생술(CPR) 교육 참가자 모집',
        content: '<p>응급 상황 대처 능력을 기르기 위한 심폐소생술 교육을 실시합니다.</p>',
        views: 600,
        createdAt: new Date('2023-09-15')
      },
      {
        type: '일반',
        title: '건물 내 금연 구역 흡연 단속 강화',
        content: '<p>쾌적한 환경 조성을 위해 금연 구역 내 흡연 단속을 강화합니다.</p>',
        views: 1100,
        createdAt: new Date('2023-09-10')
      },
      {
        type: '점검',
        title: '수질 검사 결과 안내 (적합)',
        content: '<p>정기 수질 검사 결과 모든 항목 적합 판정을 받았습니다.</p>',
        views: 300,
        createdAt: new Date('2023-09-05')
      }
    ];

    await Notice.insertMany(mockNotices);
    res.json({ message: '가짜 공지사항 데이터 15개가 생성되었습니다.' });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ message: '데이터 생성 중 오류가 발생했습니다.' });
  }
});


// 6. Civil Complaint Feature
import Complaint from './models/Complaint.js';

// Middleware for auth check (simplified)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_this_for_production');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// Get All Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Get Complaints Error:', error);
    res.status(500).json({ message: '민원 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// Get Single Complaint
app.get('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: '민원을 찾을 수 없습니다.' });
    res.json(complaint);
  } catch (error) {
    console.error('Get Complaint Error:', error);
    res.status(500).json({ message: '민원을 불러오는 중 오류가 발생했습니다.' });
  }
});

// Create Complaint
app.post('/api/complaints', auth, async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const newComplaint = new Complaint({
      title,
      content,
      priority,
      author: req.user.id,
      authorName: req.user.name
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({ message: '민원 등록 중 오류가 발생했습니다.' });
  }
});

// Update Complaint
app.put('/api/complaints/:id', auth, async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) return res.status(404).json({ message: '민원을 찾을 수 없습니다.' });
    
    // Check ownership
    if (complaint.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '본인의 민원만 수정할 수 있습니다.' });
    }

    complaint.title = title || complaint.title;
    complaint.content = content || complaint.content;
    complaint.priority = priority || complaint.priority;
    
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error('Update Complaint Error:', error);
    res.status(500).json({ message: '민원 수정 중 오류가 발생했습니다.' });
  }
});

// Building Status (Parking, Elevators)
app.get('/api/building-status', async (req, res) => {
  try {
    // 1. Calculate Parking
    const users = await User.find({}, 'vehicles');
    const totalOccupied = users.reduce((sum, u) => sum + (u.vehicles?.length || 0), 0);
    const maxParking = 60;

    // 2. Derive Elevator Status from Complaints
    // Search for active complaints about elevators
    const elevatorComplaints = await Complaint.find({
      title: { $regex: /엘리베이터|승강기/, $options: 'i' },
      status: { $ne: 'Complete' }
    });

    // Default status
    const status = {
      parking: {
        occupied: totalOccupied,
        total: maxParking,
        percent: Math.round((totalOccupied / maxParking) * 100)
      },
      elevators: [
        { id: '1-4', name: '엘리베이터 1-4호기', status: 'Normal', note: '정상 운행' },
        { id: '5', name: '엘리베이터 5호기', status: 'Normal', note: '정상 운행' }
      ],
      maintenance: {
        lastCheck: '오늘',
        status: 'Optimal'
      },
      activeComplaintsCount: await Complaint.countDocuments({ status: { $ne: 'Complete' } }),
      processingComplaintsCount: await Complaint.countDocuments({ status: 'Processing' }),
      pendingComplaintsCount: await Complaint.countDocuments({ status: 'Pending' }),
      completeComplaintsCount: await Complaint.countDocuments({ status: 'Complete' })
    };

    // If there are active complaints about elevators, update the status
    if (elevatorComplaints.length > 0) {
      status.elevators[1].status = 'Warning';
      status.elevators[1].note = '점검 및 수리 중';
    }

    res.json(status);
  } catch (error) {
    console.error('Building Status Error:', error);
    res.status(500).json({ message: '빌딩 현황을 불러오는 중 오류가 발생했습니다.' });
  }
});

// Seed Mock Complaints
app.post('/api/complaints/seed', async (req, res) => {
  try {
    await Complaint.deleteMany({});
    
    // Find a random user to assign as author if any exists
    const someUser = await User.findOne();
    const authorId = someUser ? someUser._id : new mongoose.Types.ObjectId();
    const authorName = someUser ? someUser.name : '홍길동';

    const mockComplaints = [
      { title: '지하 주차장 입구 조명 고장', content: '입구쪽 조명이 깜빡거려요.', priority: 'Medium', status: 'Pending', author: authorId, authorName },
      { title: '3층 화장실 누수', content: '세면대 아래에서 물이 샙니다.', priority: 'High', status: 'Processing', author: authorId, authorName },
      { title: '승강기 소음 문의', content: '2호기 승강기에서 끼익 소리가 납니다.', priority: 'Medium', status: 'Pending', author: authorId, authorName },
      { title: '로비 에어컨 온도 조절 요청', content: '너무 추워요 조금만 낮춰주세요.', priority: 'Low', status: 'Complete', author: authorId, authorName },
      { title: '복도 바닥 청소 요청', content: '5층 복도에 커피 자국이 있어요.', priority: 'Low', status: 'Pending', author: authorId, authorName },
      { title: '계단실 비상등 점검 요망', content: 'B구역 4층 비상등이 안들어와요.', priority: 'High', status: 'Pending', author: authorId, authorName },
      { title: '분리수거 구역 냄새', content: '청소 주기 좀 늘려주세요.', priority: 'Medium', status: 'Processing', author: authorId, authorName },
      { title: '창문 잠금장치 수리', content: '710호 창문이 잘 안잠겨요.', priority: 'Medium', status: 'Complete', author: authorId, authorName },
      { title: '와이파이 신호 약함', content: '휴게실 안쪽에서 인터넷이 끊겨요.', priority: 'Low', status: 'Pending', author: authorId, authorName },
      { title: '옥상 정원 벤치 수리', content: '부서진 곳이 있어 위험해 보입니다.', priority: 'High', status: 'Complete', author: authorId, authorName }
    ];

    await Complaint.insertMany(mockComplaints);
    res.json({ message: '샘플 민원 데이터 10개가 생성되었습니다.' });
  } catch (error) {
    console.error('Complaint Seed Error:', error);
    res.status(500).json({ message: '데이터 생성 중 오류가 발생했습니다.' });
  }
});

// Serve Static Files (Vite build output)
app.use(express.static(path.join(rootDir, 'dist')));

// SPA Fallback: 모든 경로를 index.html로 리다이렉트 (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
