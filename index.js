const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 기본 라우트 - index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API 라우트들을 여기에 추가
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 인증 API 라우트 (공개)
const authRoutes = require('./api/auth');
app.use('/api/auth', authRoutes);

// 디버그 라우트 (임시)
const debugRoutes = require('./api/debug');
app.use('/api/debug', debugRoutes);

// 채널 API 라우트 (인증 필요)
const channelRoutes = require('./api/channels');
const { authenticate } = require('./middleware/auth');
app.use('/api/channels', authenticate, channelRoutes);

// Vercel은 서버리스 환경이므로 listen을 사용하지 않음
// 개발 환경에서만 사용
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;