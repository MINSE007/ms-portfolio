/* =====================================================================
   MS Portfolio — 사이트 내용 (글·작품·연락처는 전부 여기서 고쳐요)
   ---------------------------------------------------------------------
   · 따옴표 "..." 안의 글만 바꾸면 돼요. 쉼표(,)와 괄호는 지우지 마세요.
   · 관리자 모드(주소 끝에 #admin)에서 고치고 "GitHub에 저장"을 누르면
     이 파일이 통째로 새로 저장돼요. (이 안내 글도 같이 다시 써져요)
   · 숫자(참여한 영화·수상·제작 예정)는 작품 목록을 세서 자동으로 나와요.
   ===================================================================== */
window.SITE = {
  /* ① 사이트 이름 */
  "site": {
    "name": "MS PORTFOLIO",
    "eyebrow": "MS PORTFOLIO — YOUTUBE · FILM · EDIT"
  },

  /* ② 인트로 — 키워드가 순서대로 크게 나온 뒤 슬로건으로 이어져요 */
  "intro": {
    "keywords": [
      { "en": "YOUTUBE", "ko": "유튜브 · 카워드 스튜디오" },
      { "en": "FILM", "ko": "영화 · 연출 / 촬영 / 음향" },
      { "en": "EDIT", "ko": "편집 · 8년" }
    ]
  },

  /* ③ 첫 화면 */
  "hero": {
    "metaLeft": "PORTFOLIO — 2026",
    "metaRight": "유튜브 · 영화 · 편집 — MS",
    "nowTitle": "NOW · 지금 만드는 것",
    "title1": "잘 짖고, 잘 놀고,",
    "title2": "잘 만듭니다.",
    "sub": "유튜브 채널 카워드 스튜디오를 만들고, 영화 현장에서는 연출부터 촬영, 음향까지 맡아왔습니다.",
    "subStrong": "카워드 스튜디오",
    "btn1": "유튜브 채널 보기",
    "btn2": "영화 포트폴리오",
    "facts": [
      { "value": "8", "unit": "년", "label": "편집 경력" },
      { "value": "auto:films", "unit": "편", "label": "참여한 영화" },
      { "value": "auto:awards", "unit": "회", "label": "수상 · 입선" },
      { "value": "auto:next", "unit": "편", "label": "제작 예정" }
    ]
  },

  /* ④ 섹션 순서와 보이기 (위에서부터 이 순서대로 나와요. show:false면 숨김) */
  "layout": [
    { "id": "youtube", "show": true },
    { "id": "film", "show": true },
    { "id": "edit", "show": true },
    { "id": "contact", "show": true }
  ],

  /* ⑤ 유튜브 */
  "youtube": {
    "en": "YOUTUBE",
    "badge": "MAIN",
    "title": "유튜브",
    "desc": "제일 많이, 제일 즐겁게 하는 일. 직접 기획하고 찍고 편집합니다.",
    "channel": {
      "name": "카워드 스튜디오",
      "handle": "@c_ward",
      "tagline": "잘 짖고, 잘 놀고, 잘 만듭니다.",
      "url": "https://www.youtube.com/@c_ward",
      "avatar": "",
      "role": "기획 · 촬영 · 편집",
      "button": "채널 방문하기"
    },
    "videos": [
      { "title": "이게 뭔 스킨이야", "id": "C0VnVbcB8-g" },
      { "title": "한국인이 아시아 섭 하면 생기는 일", "id": "HX09tGF0QPc" },
      { "title": "롤 좋아하는 친구들이랑 볼링 치러가면 생기는 일", "id": "Ih2qKrALhaI" },
      { "title": "친구랑 손절할 뻔했습니다", "id": "YX6wRNR4XbA" }
    ]
  },

  /* ⑥ 영화 — 작품 하나 = { 제목, 연도, 역할들, 기록들 }
        역할: 연출 연출부 스크립터 / 촬영 촬영부 / 조명 조명부 / 음향 음향부 /
              제작 PD 제작부 / 미술 미술부 / 편집 편집부 / 배우
        기록: '수상·입선·감독상·장상·은상·동상'이 들어가면 ★수상, '출품'이 들어가면 바로 보이고
              나머지(상영 등)는 '+' 눌러야 보여요 */
  "film": {
    "en": "FILM",
    "badge": "SUB",
    "title": "영화",
    "desc": "연출, 촬영, 음향, 배우까지. 현장의 여러 자리에서 영화를 만들어 왔습니다.",
    "films": [
      { "title": "이륙!", "year": 2026, "roles": ["연출"], "records": ["29초 영화제 ICN 공모전 출품"] },
      { "title": "黃昏(황혼)", "year": 2026, "roles": ["연출"], "records": ["비브리유 공모전 출품"] },
      { "title": "Monage!", "year": 2026, "roles": ["제작부"], "records": [] },
      { "title": "아빠의 방식", "year": 2026, "roles": ["제작"], "records": ["26 여름영화 상영"] },
      { "title": "Emotion Store", "year": 2026, "roles": ["제작부"], "records": ["26 여름영화 상영"] },
      { "title": "성장통", "year": 2026, "roles": ["촬영부"], "records": ["청소년 미디어 대전 출품"] },
      { "title": "영상고 옥상엔 요술램프가 있다! (26 SVMHS 뮤지컬)", "year": 2026, "roles": ["음향"], "records": ["서울영상고등학교 공식 유튜브 업로드"] },
      { "title": "읽음", "year": 2026, "roles": ["연출"], "records": ["청소년 광고대회 입선"] },
      { "title": "빨래방", "year": 2026, "roles": ["제작"], "records": ["시 영상제"] },
      { "title": "내가 사랑하는 사람", "year": 2026, "roles": ["제작"], "records": ["시 영상제"] },
      { "title": "헤드 퍼스트 슬라이딩", "year": 2026, "roles": ["제작부"], "records": [] },
      { "title": "나는 오늘!!", "year": 2026, "roles": ["촬영부", "조명부"], "records": ["시 영상제 동상 수상"] },
      { "title": "아트필름 홍보영상", "year": 2026, "roles": ["촬영부", "편집"], "records": ["2026 동아리 홍보영상 상영"] },
      { "title": "사랑의 색체", "year": 2026, "roles": ["제작부"], "records": ["청소년 미디어 대전 출품"] },
      { "title": "유흔", "year": 2025, "roles": ["연출부"], "records": ["동랑제 감독상 수상", "26 여름영화 상영"] },
      { "title": "땅볼아웃", "year": 2025, "roles": ["배우"], "records": ["스스로넷 상영"] },
      { "title": "Scholl Of Roll (25 SVMHS 뮤지컬)", "year": 2025, "roles": ["배우"], "records": ["25 청소년 미디어 대전 수상"] },
      { "title": "무제-Untitled", "year": 2025, "roles": ["제작", "미술"], "records": ["25 청소년 미디어 대전 수상"] },
      { "title": "비밀하나", "year": 2025, "roles": ["제작부"], "records": ["25 여름영화 상영"] },
      { "title": "도박 중독 예방 광고", "year": 2025, "roles": ["음향"], "records": [] },
      { "title": "작은 불씨", "year": 2025, "roles": ["음향"], "records": [] },
      { "title": "적반하장", "year": 2025, "roles": ["배우"], "records": [] },
      { "title": "Awaken The Bull", "year": 2025, "roles": ["연출", "촬영"], "records": [] },
      { "title": "환생검문소", "year": 2025, "roles": ["음향"], "records": ["26 보건복지부장상 수상", "26 교내 흡연예방 UCC 은상", "25 여름영화 상영"] },
      { "title": "자화상", "year": 2025, "roles": ["촬영", "편집"], "records": ["시 영상제 상영"] }
    ],
    "picksTitle": "수상 · 입선작",
    "nextTitle": "준비 중인 작품",
    "next": [
      { "title": "혈모양처", "role": "배우" },
      { "title": "시취나는 꽃", "role": "음향" },
      { "title": "아트필름 겨울영화", "role": "" },
      { "title": "다시, 변신", "role": "연출" },
      { "title": "2027 시영상제", "role": "연출" },
      { "title": "2027 졸업작품", "role": "연출" }
    ]
  },

  /* ⑦ 편집 */
  "edit": {
    "en": "EDIT",
    "badge": "SUB",
    "title": "편집",
    "desc": "모든 작업은 결국 편집에서 완성됩니다.",
    "years": "8",
    "lead": "편집은 촬영이 끝난 뒤에 시작되는 두 번째 연출이라고 생각해요. 유튜브의 빠른 호흡부터 단편 영화의 긴 여운까지, 찍어둔 장면이 가장 잘 보이는 순서를 찾는 일을 8년째 해오고 있습니다. 기획 단계부터 편집을 생각하고, 현장에서도 편집을 생각하며 찍습니다.",
    "skills": [
      { "icon": "plan", "title": "기획", "en": "PLANNING", "desc": "무엇을 찍을지부터 정합니다. 유튜브 콘텐츠 아이디어와 단편 영화의 이야기를 직접 짜고 다듬습니다." },
      { "icon": "prod", "title": "제작", "en": "PRODUCTION", "desc": "현장이 굴러가게 만드는 일. 제작부로 일정과 장소, 사람을 챙기며 여러 작품을 끝까지 함께했습니다." },
      { "icon": "edit", "title": "편집", "en": "EDITING", "desc": "가장 오래 붙잡아 온 일. 컷과 자막, 음악과 리듬까지 맞춰 찍어둔 장면을 한 편의 이야기로 완성합니다." },
      { "icon": "cam", "title": "촬영", "en": "CAMERA", "desc": "카메라를 직접 잡고 장면을 담아왔습니다. 편집할 때 필요한 화면을 알기에 현장에서 더 정확하게 찍습니다." }
    ]
  },

  /* ⑧ 연락 */
  "contact": {
    "en": "CONTACT",
    "title": "함께 만들어요",
    "clientEyebrow": "FOR CLIENTS",
    "clientTitle": "작업 의뢰",
    "clientDesc": "유튜브 영상 편집, 촬영, 단편 영화 작업이 필요하다면 편하게 연락 주세요.",
    "email": "eddy0730@naver.com",
    "instagram": "@ms_xy.0",
    "instagramUrl": "https://www.instagram.com/ms_xy.0/",
    "viewerEyebrow": "FOR VIEWERS",
    "viewerTitle": "카워드 스튜디오",
    "viewerDesc": "새 영상은 유튜브에 가장 먼저 올라갑니다.",
    "viewerLink": "채널 구독하러 가기"
  },

  /* ⑨ 맨 아래 */
  "footer": {
    "info": "유튜브 · 영화 · 편집",
    "info2": "YouTube 카워드 스튜디오 @c_ward",
    "address": "서울특별시 양천구 목동로11길 46 (신정동)",
    "copyright": "© 2026 MS Portfolio. All rights reserved."
  }
};
