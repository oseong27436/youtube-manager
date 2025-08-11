// API 기본 URL
const API_URL = 'https://youtube-manager-puce.vercel.app/api';
let authToken = localStorage.getItem('token');
let currentUser = null;

// 페이지 로드 시 초기화
window.onload = function() {
    if (authToken) {
        checkAuth();
    }
};

// 인증 확인
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            showDashboard();
        } else {
            localStorage.removeItem('token');
            showAuth();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showAuth();
    }
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('token', authToken);
            currentUser = data.user;
            showDashboard();
        } else {
            errorElement.textContent = data.error || '로그인 실패';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = '서버 연결 실패';
        errorElement.style.display = 'block';
    }
}

// 회원가입 처리
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorElement = document.getElementById('registerError');
    const successElement = document.getElementById('registerSuccess');
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            successElement.textContent = '회원가입 성공! 로그인해주세요.';
            successElement.style.display = 'block';
            errorElement.style.display = 'none';
            
            // 2초 후 로그인 폼으로 전환
            setTimeout(() => {
                showLogin();
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else {
            errorElement.textContent = data.error || '회원가입 실패';
            errorElement.style.display = 'block';
            successElement.style.display = 'none';
        }
    } catch (error) {
        errorElement.textContent = '서버 연결 실패';
        errorElement.style.display = 'block';
    }
}

// 로그아웃
function handleLogout() {
    localStorage.removeItem('token');
    authToken = null;
    currentUser = null;
    showAuth();
}

// 채널 목록 로드
async function loadChannels() {
    try {
        const response = await fetch(`${API_URL}/channels`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const channels = await response.json();
            displayChannels(channels);
        }
    } catch (error) {
        console.error('Failed to load channels:', error);
    }
}

// 채널 표시
function displayChannels(channels) {
    const grid = document.getElementById('channelGrid');
    const count = document.getElementById('channelCount');
    
    count.textContent = channels.length;
    
    if (channels.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <h3 style="color: #999;">아직 등록된 채널이 없습니다</h3>
                <p style="color: #bbb; margin-top: 10px;">+ 버튼을 눌러 첫 번째 채널을 추가해보세요</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = channels.map(channel => `
        <div class="channel-card">
            <div class="channel-name">${channel.name}</div>
            <div class="channel-stats">
                채널 ID: ${channel.channelId}<br>
                ${channel.description || '설명 없음'}<br>
                구독자: ${channel.subscriberCount || 0}명
            </div>
            <div class="channel-actions">
                <button class="btn-small btn-edit" onclick="editChannel('${channel._id}')">수정</button>
                <button class="btn-small btn-delete" onclick="deleteChannel('${channel._id}')">삭제</button>
            </div>
        </div>
    `).join('');
}

// 채널 추가
async function handleAddChannel(event) {
    event.preventDefault();
    
    const name = document.getElementById('channelName').value;
    const channelId = document.getElementById('channelId').value;
    const description = document.getElementById('channelDescription').value;
    
    try {
        const response = await fetch(`${API_URL}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, channelId, description })
        });
        
        if (response.ok) {
            closeModal();
            loadChannels();
            // 폼 초기화
            document.getElementById('channelName').value = '';
            document.getElementById('channelId').value = '';
            document.getElementById('channelDescription').value = '';
        } else {
            alert('채널 추가 실패');
        }
    } catch (error) {
        alert('서버 연결 실패');
    }
}

// 채널 삭제
async function deleteChannel(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        const response = await fetch(`${API_URL}/channels/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            loadChannels();
        }
    } catch (error) {
        alert('삭제 실패');
    }
}

// UI 전환 함수들
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginError').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('registerError').style.display = 'none';
    document.getElementById('registerSuccess').style.display = 'none';
}

function showAuth() {
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';
}

function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('userInfo').textContent = currentUser.username;
    }
    
    loadChannels();
}

function showAddChannelModal() {
    document.getElementById('addChannelModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addChannelModal').style.display = 'none';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('addChannelModal');
    if (event.target === modal) {
        closeModal();
    }
};