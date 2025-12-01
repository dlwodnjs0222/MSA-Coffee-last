/**
 * common.js - 공통 기능 및 네비게이션 바 상태 관리
 */

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar(); // 1. 페이지 로드 시 네비바 상태 업데이트
    bindLogoutEvent(); // 2. 로그아웃 버튼 이벤트 연결
    bindMenuEvents(); // 3. 메뉴 링크 클릭 시 권한 체크
});

// 1. 로그인 상태에 따라 네비게이션 바 UI 변경
function updateNavbar() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // 네비바 요소 가져오기
    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const userNav = document.getElementById('userNav');
    const logoutNav = document.getElementById('logoutNav');
    const usernameDisplay = document.getElementById('username');
    const changePasswordNav = document.getElementById('changePasswordNav');

    // 요소가 없는 페이지(네비바가 없는 경우)에서는 실행 중단
    if (!loginNav || !userNav) return;

    if (token && username) {
        // [로그인 상태]
        if (loginNav) loginNav.classList.add('d-none');
        if (registerNav) registerNav.classList.add('d-none');

        if (userNav) userNav.classList.remove('d-none');
        if (logoutNav) logoutNav.classList.remove('d-none');
        if (changePasswordNav) changePasswordNav.classList.remove('d-none');

        if (usernameDisplay) {
            const roleText = role === 'ADMIN' ? '관리자' : '회원';
            usernameDisplay.textContent = `${username} (${roleText})님`;
        }
    } else {
        // [비로그인 상태]
        if (loginNav) loginNav.classList.remove('d-none');
        if (registerNav) registerNav.classList.remove('d-none');

        if (userNav) userNav.classList.add('d-none');
        if (logoutNav) logoutNav.classList.add('d-none');
        if (changePasswordNav) changePasswordNav.classList.add('d-none');
    }
}

// 2. 로그아웃 이벤트 바인딩
function bindLogoutEvent() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        // 기존 이벤트 제거 후 다시 등록 (중복 방지)
        const newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);

        newBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // 서버 로그아웃 요청 (쿠키 삭제용 - 선택 사항)
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (err) {
                console.log("서버 로그아웃 통신 중 오류 (무시 가능)");
            }

            // 클라이언트 정보 삭제
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');

            alert('로그아웃 되었습니다.');
            window.location.href = '/';
        });
    }
}

// 3. 메뉴 접근 권한 체크 (로그인 필요 메뉴 클릭 시)
function bindMenuEvents() {
    const protectedLinks = document.querySelectorAll('a[href="/orders"], a[href="/stocks"], a[href="/dashboard"], a[href="/admin"]');

    protectedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const token = localStorage.getItem('token');
            if (!token) {
                e.preventDefault(); // 이동 막기
                if(confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
                    window.location.href = "/login";
                }
            }
        });
    });
}

/**
 * ★ [추가] 4. 페이지 진입 후 권한 체크 (주소창 직접 입력 방어 - 2차 방어선)
 * @param {Array} allowedRoles - 허용된 역할 목록 (예: ['ADMIN'] 또는 ['USER', 'ADMIN'])
 */
function checkPagePermission(allowedRoles) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 1. 비로그인 체크
    if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = '/login';
        return false;
    }

    // 2. 권한(Role) 체크
    // allowedRoles가 존재하는데, 내 role이 그 안에 없으면 쫓아냄
    if (allowedRoles && !allowedRoles.includes(role)) {
        alert("관리자 권한이 필요합니다.");
        window.location.href = '/';
        return false;
    }

    return true; // 통과
}