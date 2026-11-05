# MS Portfolio

유튜브 · 영화 · 편집 포트폴리오 사이트

## 파일 구조 (고칠 때 어디를 보면 되는지)

| 파일 | 하는 일 |
|---|---|
| `js/data.js` | **사이트 내용 전부** — 글, 작품 목록, 유튜브 영상, 연락처, 섹션 순서 |
| `css/base.css` | 색 · 글꼴 · 위쪽 메뉴 · 맨 아래 · 버튼 (색은 맨 위 `:root`에서 한 번에) |
| `css/sections.css` | 첫 화면 · 유튜브 · 영화 · 편집 · 연락 섹션 모양 |
| `css/intro.css`, `js/intro.js` | 처음 들어올 때 나오는 키워드 인트로 (`STEP`, `HOLD`로 속도 조절) |
| `js/render.js` | data.js 내용을 화면에 그리는 코드 |
| `css/admin.css`, `js/admin.js` | 관리자 모드 |
| `index.html` | 뼈대 (거의 고칠 일 없음) |

## 관리자 모드

주소 끝에 `#admin`, 또는 `Ctrl+Shift+E`, 또는 맨 아래 © 글자 세 번 클릭.
점선 테두리 글자를 눌러 고치고, 패널에서 섹션 순서·영화 목록을 바꾼 뒤
**GitHub에 저장**을 누르면 `js/data.js`가 새로 저장돼요 (토큰 필요).
