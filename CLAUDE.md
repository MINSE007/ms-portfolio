# MS Portfolio — Claude Code 작업 안내

김민서(유튜브 '카워드 스튜디오' @c_ward, 서울영상고) 영상 포트폴리오 사이트.
이 파일은 claude.ai에서 진행하던 작업을 Claude Code로 옮기면서 정리한 것. 작업 전에 꼭 읽기.

## 주소 · 배포
- 저장소: `MINSE007/ms-portfolio` (공개). 빌드 없음, 순수 HTML/CSS/JS.
- **Cloudflare Pages(메인)**: https://ms-p5rt-folio.pages.dev — `main`에 push하면 1~2분 뒤 자동 배포.
- GitHub Pages: https://minse007.github.io/ms-portfolio/ (같은 main).
- 로컬 확인: `python3 -m http.server 8765` → http://localhost:8765

## 작업 규칙 (사용자 선호 — 꼭 지키기)
1. **대화·보고는 한국어**. ■ 소제목 + 번호/불릿 목록으로 짧게. 전문 용어는 쉬운 말로.
2. 수정사항은 사용자가 번호 목록으로 줌 → **한 번에 크게 바꾸지 말고 작게** 고침.
3. 고친 뒤 반드시 검사:
   - JS 문법: `node -e "new Function(require('fs').readFileSync('js/render.js','utf8'))"` (render/admin/data/intro 모두)
   - CSS 중괄호 개수 `{` = `}` 확인
   - 요소 id 중복·누락 확인
4. **PC(1440px) + 모바일(iPhone 13) 스크린샷을 매번 보여주기** (Playwright). 가로 넘침(scrollWidth > innerWidth) 없는지 확인.
5. 눈으로 직접 확인 못 한 것은 "확인 못 했다"고 솔직히 말하기.
6. 고친 css/js가 바로 보이도록 `index.html`의 `?v=` 버전 값 올리기 (현재 `?v=1116a`, 형식: 월일+문자).
7. **push 전에 항상 `git pull`** — 관리자 모드 저장이 원격에 커밋("관리자 모드에서 내용 수정")을 올리기 때문.
8. 커밋 작성자: `git -c user.name="MINSE007" -c user.email="MINSE007@users.noreply.github.com" commit`, 메시지는 한국어로 무엇을 바꿨는지.

## 보안 (절대 지킬 것)
- 관리자 비밀번호는 파일에 넣지 않음. `js/data.js`의 `admin`에는 해시만 있음
  (sha256 of `msp-admin-v1|아이디|비번`). 관리자 아이디 `river3497`.
- GitHub 토큰은 사용자 브라우저 localStorage(`msp-gh-token`)에만 있음. 코드·커밋에 넣지 않기.
- 비밀번호·토큰·인증번호 입력은 사용자가 직접. 저장소 설정의 Danger zone 버튼은 누르지 않기.

## 파일 구조
| 파일 | 하는 일 |
|---|---|
| `js/data.js` | 사이트 내용 전부 (`window.SITE`). **관리자 저장이 JSON 형태로 통째로 다시 씀** → 손으로 고칠 땐 node로 읽어 고친 뒤 `head + 'window.SITE = ' + JSON.stringify(S,null,2) + ';\n'`로 쓰기 |
| `js/render.js` | data.js → 화면. 섹션별 렌더 함수(youtube/outsource/film/dasi/edit/contact), 발자취 타임라인(`seqSet`, `seqLayout`), 썸네일 로딩, `applyStyles()` |
| `js/admin.js` | 관리자 모드: 로그인, 탭(배치/유튜브/외주/영화/편집/설정/저장), 글자 도구(크기·굵기·색·정렬 → `S.style`), 2초 뒤 GitHub Contents API로 자동 저장(409/422면 sha 다시 받아 재시도) |
| `js/intro.js`, `css/intro.css` | 인트로: 슬레이트(MS STUDIO / SCENE 09 / CUT 07 / TAKE 30 / director kimminseo, 날짜 자동, Nanum Pen Script 손글씨) → 타이포 컷. 스크롤·클릭하면 페이드아웃 |
| `css/base.css` | 색 토큰(`:root`, `[data-theme="light"]`), 메뉴, 섹션 머리(`.sh`), 버튼 |
| `css/sections.css` | 섹션 모양 |
| `index.html` | 뼈대. data.js는 캐시 안 타게 `?t=Date.now()`로 불러옴. 윈도우면 `html.win`(카드 blur 끔) |

## 섹션 (data.js `layout` 순서)
1. **첫 화면(hero)** — "상상을 현실로." + 숫자 3개(편집 경력 등)
2. **유튜브** — 카워드 스튜디오 채널 카드 + 영상 4개
3. **외부 작업(outsource)** — 카드 한 줄에 하나, 왼쪽 영상 2개 크게(`videos:[{title,link}]`) + 오른쪽 설명
   - 십세들 (THE SMC 그룹, 음향감독) / SSRC 청소년 로봇대회 · NAPKO (마케팅·SNS, **마케팅 부문 2위** — 사용자 확인)
4. **영화(film)** — 대표작 3편 + 필모그래피(역할 필터 탭). 역할 '제작'은 '프로듀서'로 통일.
5. **다시, 변신(dasi)** — 사용자가 찍는 단편. 영상 + 개요 + 프리/프로덕션/포스트 진행 줄
6. **발자취(edit)** — 큰 연도 + 그 해 이야기(`short` 요약, 원문은 `desc`에 보관) / 얇은 타임라인(재생선 끌기·휠, 끝에서 멈춤, 클립은 글씨 없이 색만) / 쓰는 프로그램(Pr·Ae·Ps·Ai)
   - 연도: 2022 이전 ~ 2026. 2022 이전은 아직 내용 없음(`edit.intro0` 한 줄).
7. **연락(contact)** + 맨 아래(관리자 로그인, 인트로 다시 보기)

## 디자인 방향 (최근 결정)
- 색: 보라빛 어두운 배경 + 연보라 포인트(`--acc`), 라이트 모드 있음(오른쪽 위 달 버튼, 그 옆이 인트로 다시 보기 버튼).
- **"AI 느낌 말고 사람 느낌"**: 영문 라벨·뱃지(02 OUTSOURCING, WORK)는 숨김(관리자 모드에선 보임),
  섹션 설명은 손글씨체(Nanum Pen Script)로 살짝 기울여 메모처럼. 카드 hover 들썩임, CASE 번호, ↗ 표시는 뺐음.
- 프리미어 시퀀스 창 디자인은 사용자가 원해서 없앴음(페이지에 녹이는 쪽으로).
- 참고한 사이트: https://hayulportfolio.pages.dev/ (상단 시퀀스 바)

## 남은 것 / 다음 후보
- 첫 화면·영화·다시 변신·연락 칸도 같은 '사람 느낌'으로 다듬을지 사용자에게 확인 필요.
- 2022 이전 발자취 내용, 발자취 작은 클립들의 설명은 비어 있음.
- MS Client(사용자의 다른 앱) 스튜디오 모드 1번 버튼이 이 사이트로 가는 바로가기 — 주소를 Cloudflare 주소로 맞출지 확인 필요.
