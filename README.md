# YouTube Channel Manager

YouTube 채널을 효율적으로 관리하는 웹 애플리케이션

## 기능
- 사용자 인증 (회원가입/로그인)
- YouTube 채널 추가/수정/삭제
- 채널 정보 관리

## 기술 스택
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Hosting: Vercel

## 로컬 실행
```bash
npm install
npm run dev
```

## 환경변수
`.env` 파일 생성:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 배포
```bash
git push origin main
```
Vercel이 자동으로 배포합니다.