const { exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

// 파일 감시 및 자동 배포
const watcher = chokidar.watch('.', {
  ignored: [
    'node_modules/**',
    '.git/**',
    '*.log',
    '.env',
    'auto-deploy.js'
  ],
  persistent: true,
  ignoreInitial: true
});

let deployTimeout;

function deploy() {
  console.log('🚀 자동 배포 시작...');
  
  exec('git add . && git commit -m "Auto deploy" && git push', (error, stdout, stderr) => {
    if (error) {
      console.error(`배포 실패: ${error}`);
      return;
    }
    console.log('✅ 배포 성공!');
    console.log(stdout);
  });
}

watcher.on('change', (filePath) => {
  console.log(`📝 파일 변경 감지: ${filePath}`);
  
  // 디바운싱 - 여러 파일 변경 시 한 번만 배포
  clearTimeout(deployTimeout);
  deployTimeout = setTimeout(() => {
    deploy();
  }, 5000); // 5초 대기 후 배포
});

console.log('👀 파일 감시 중... (변경 시 자동 배포)');
console.log('종료: Ctrl+C');