const express = require('express');
const router = express.Router();

// 환경변수 디버깅 (보안상 일부만 표시)
router.get('/', (req, res) => {
  const mongoUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;
  
  res.json({
    mongodb: {
      exists: !!mongoUri,
      length: mongoUri?.length,
      starts: mongoUri?.substring(0, 20),
      includes_cluster: mongoUri?.includes('cluster0.bweogvs'),
      includes_password: mongoUri?.includes('BMMDywqkK3o1oorV')
    },
    jwt: {
      exists: !!jwtSecret,
      length: jwtSecret?.length
    },
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;