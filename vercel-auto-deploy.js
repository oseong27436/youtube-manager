const { exec } = require('child_process');
const chokidar = require('chokidar');

// Vercel CLI로 직접 배포 (Git 없이)
const watcher = chokidar.watch('.', {
  ignored: [
    'node_modules/**',
    '.git/**',
    '*.log',
    '.env',
    '.vercel/**',
    'vercel-auto-deploy.js'
  ],
  persistent: true,
  ignoreInitial: true
});

let deployTimeout;

function deployToVercel() {
  console.log('🚀 Vercel로 자동 배포 중...');
  
  exec('vercel --prod --yes', (error, stdout, stderr) => {
    if (error) {
      console.error(`배포 실패: ${error}`);
      return;
    }
    console.log('✅ Vercel 배포 완료!');
    console.log(stdout);
  });
}

watcher.on('change', (filePath) => {
  console.log(`📝 파일 변경: ${filePath}`);
  
  clearTimeout(deployTimeout);
  deployTimeout = setTimeout(() => {
    deployToVercel();
  }, 5000); // 5초 후 배포
});

console.log('👀 파일 감시 중... (Git 없이 Vercel 직접 배포)');
console.log('종료: Ctrl+C');