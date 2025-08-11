const API_URL = 'https://youtube-manager-puce.vercel.app';

// 테스트용 사용자 정보
const testUser = {
  username: 'testuser' + Date.now(), // 유니크한 username
  email: `test${Date.now()}@example.com`, // 유니크한 email
  password: 'password123'
};

async function testAuth() {
  console.log('🚀 인증 시스템 테스트 시작...\n');
  
  try {
    // 1. 회원가입 테스트
    console.log('1️⃣ 회원가입 테스트');
    console.log('요청:', testUser);
    
    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const registerData = await registerResponse.json();
    console.log('응답:', registerData);
    
    if (!registerResponse.ok) {
      throw new Error(`회원가입 실패: ${registerData.error}`);
    }
    
    const token = registerData.token;
    console.log('✅ 회원가입 성공! 토큰 받음\n');
    
    // 2. 로그인 테스트
    console.log('2️⃣ 로그인 테스트');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('응답:', loginData);
    
    if (!loginResponse.ok) {
      throw new Error(`로그인 실패: ${loginData.error}`);
    }
    
    console.log('✅ 로그인 성공!\n');
    
    // 3. 인증된 요청 테스트 (내 정보 조회)
    console.log('3️⃣ 인증된 요청 테스트 (내 정보)');
    const meResponse = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const meData = await meResponse.json();
    console.log('응답:', meData);
    
    if (!meResponse.ok) {
      throw new Error(`내 정보 조회 실패: ${meData.error}`);
    }
    
    console.log('✅ 인증된 요청 성공!\n');
    
    // 4. 채널 API 테스트 (인증 필요)
    console.log('4️⃣ 채널 목록 조회 (인증 필요)');
    const channelsResponse = await fetch(`${API_URL}/api/channels`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const channelsData = await channelsResponse.json();
    console.log('응답:', channelsData);
    
    if (!channelsResponse.ok) {
      throw new Error(`채널 조회 실패: ${channelsData.error}`);
    }
    
    console.log('✅ 채널 API 접근 성공!\n');
    
    // 5. 인증 없이 채널 API 접근 시도 (실패해야 함)
    console.log('5️⃣ 인증 없이 채널 API 접근 시도');
    const noAuthResponse = await fetch(`${API_URL}/api/channels`);
    const noAuthData = await noAuthResponse.json();
    
    if (noAuthResponse.ok) {
      console.log('❌ 보안 문제: 인증 없이도 접근 가능!');
    } else {
      console.log('✅ 정상: 인증 없이는 접근 불가');
      console.log('에러 메시지:', noAuthData.error);
    }
    
    console.log('\n🎉 모든 테스트 완료!');
    console.log('📝 저장된 토큰:', token);
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

// Node.js 환경에서 실행
testAuth();