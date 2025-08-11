const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('MongoDB 연결 테스트...');
  console.log('URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공!');
    
    // 테스트 데이터 생성
    const User = require('./models/User');
    const testUser = new User({
      username: 'localtest' + Date.now(),
      email: `local${Date.now()}@test.com`,
      password: 'test123'
    });
    
    await testUser.save();
    console.log('✅ 사용자 생성 성공!');
    
    // 조회 테스트
    const users = await User.find();
    console.log(`✅ 현재 사용자 수: ${users.length}`);
    
    await mongoose.connection.close();
    console.log('연결 종료');
  } catch (error) {
    console.error('❌ 에러:', error.message);
    console.error('에러 타입:', error.name);
  }
}

testConnection();