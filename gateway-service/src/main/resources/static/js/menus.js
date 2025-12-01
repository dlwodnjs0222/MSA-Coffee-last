// API 엔드포인트
const MENU_SERVICE_URL = '/api/menus';

document.addEventListener('DOMContentLoaded', () => {

    if (!checkPagePermission(['ADMIN'])) return;

    loadMenuList();

    const createMenuForm = document.getElementById('create-menu-form');
    if (createMenuForm) {
        createMenuForm.addEventListener('submit', handleCreateMenu);
    }
});

// 메뉴 목록 로드
async function loadMenuList() {
    try {
        const response = await fetch(MENU_SERVICE_URL);
        if (!response.ok) throw new Error('메뉴 로딩 실패');

        const menus = await response.json();
        const tableBody = document.querySelector('#menu-stock-table tbody');
        tableBody.innerHTML = '';

        menus.forEach(menu => {
            // 이미지 경로 처리
            let imgSrc = 'https://via.placeholder.com/50?text=No+Img';
            if (menu.imageUrl) {
                imgSrc = menu.imageUrl.startsWith('http') ? menu.imageUrl : menu.imageUrl;
            }

            const row = `
                <tr>
                    <td>${menu.id}</td>
                    <td>
                        <img src="${imgSrc}" alt="${menu.name}" 
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;">
                    </td>
                    <td class="fw-bold">${menu.name}</td>
                    <td class="text-muted small">${menu.description || '-'}</td>
                    <td>${menu.price.toLocaleString()}원</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-btn" data-menu-id="${menu.id}">
                            삭제
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // 삭제 버튼 이벤트 연결
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteMenu);
        });

    } catch (error) {
        console.error('목록 로딩 실패:', error);
    }
}

// ★ [핵심 수정] 새 상품 추가 (토큰 포함)
async function handleCreateMenu(event) {
    event.preventDefault();

    // 1. 토큰 가져오기
    const token = localStorage.getItem('token');
    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = '/login';
        return;
    }

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const fileInput = document.getElementById('file');

    // 2. FormData 생성
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    }

    try {
        const response = await fetch(MENU_SERVICE_URL, {
            method: 'POST',
            headers: {
                // ★ 중요: FormData 전송 시 'Content-Type'은 설정하면 안 됨 (브라우저가 자동 설정)
                // 대신 'Authorization' 헤더는 반드시 추가해야 함!
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || '상품 추가 실패');
        }

        alert('상품이 성공적으로 추가되었습니다.');
        document.getElementById('create-menu-form').reset();
        loadMenuList(); // 목록 새로고침

    } catch (error) {
        console.error('상품 추가 에러:', error);
        alert('상품 추가 실패: ' + error.message);
    }
}

// ★ [핵심 수정] 상품 삭제 (토큰 포함)
async function handleDeleteMenu(event) {
    const button = event.target;
    const menuId = button.dataset.menuId;
    const token = localStorage.getItem('token'); // 토큰 확인

    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    if (!confirm(`[메뉴 ID: ${menuId}] 상품을 정말 삭제하시겠습니까?`)) {
        return;
    }

    try {
        const response = await fetch(`${MENU_SERVICE_URL}/${menuId}`, {
            method: 'DELETE',
            headers: {
                // ★ 삭제 요청에도 토큰이 필요합니다
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('상품 삭제 실패');
        }

        alert('상품이 성공적으로 삭제되었습니다.');
        loadMenuList();

    } catch (error) {
        console.error('상품 삭제 에러:', error);
        alert('상품 삭제 실패: ' + error.message);
    }
}