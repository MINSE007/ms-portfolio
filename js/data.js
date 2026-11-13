/* =====================================================================
   MS Portfolio — 사이트 내용 (글·작품·연락처는 전부 여기서 고쳐요)
   ---------------------------------------------------------------------
   · 따옴표 "..." 안의 글만 바꾸면 돼요. 쉼표(,)와 괄호는 지우지 마세요.
   · 글 안의 \n 은 "여기서 줄바꿈" 표시예요.
   · 관리자 모드에서 고치고 "GitHub에 저장"을 누르면 이 파일이 통째로 새로 저장돼요.
   · layout: 섹션 순서와 보이기(show) / film.films: 필모그래피
     film.picks: 대표작 3편 / dasi: 다시, 변신 (steps 진행 상황: done 완료 · now 진행 중 · todo 예정)
     역할: 연출 연출부 스크립터 / 촬영 촬영부 / 조명 조명부 / 음향 음향부 /
           제작 PD 제작부 / 미술 미술부 / 편집 편집부 / 배우
   ===================================================================== */
window.SITE = {
  "admin": {
    "shortcut": "Ctrl+Shift+E"
  },
  "ui": {
    "zoom": 1,
    "hero": 1,
    "title": 1,
    "gap": 1
  },
  "site": {
    "name": "MS PORTFOLIO",
    "eyebrow": "MS PORTFOLIO — YOUTUBE · FILM · EDIT"
  },
  "intro": {
    "cuts": [
      "YOUTUBE",
      "FILM",
      "EDIT",
      "8년",
      "상상",
      "을",
      "현실",
      "로."
    ],
    "slate": {
      "studio": "MS STUDIO",
      "scene": "09",
      "cut": "07",
      "take": "30",
      "director": "kimminseo"
    }
  },
  "hero": {
    "metaLeft": "PORTFOLIO — 2026",
    "metaRight": "유튜브 · 영화 · 편집 — MS",
    "title1": "상상을",
    "title2": "현실로.",
    "sub": "유튜브 채널 카워드 스튜디오를 만들고,\n영화 현장에서는 연출부터 배우까지 맡아왔습니다.",
    "subStrong": "카워드 스튜디오",
    "btn1": "유튜브 채널 보기",
    "btn2": "영화 포트폴리오",
    "facts": [
      {
        "value": "8",
        "unit": "년",
        "label": "편집 경력"
      },
      {
        "value": "auto:films",
        "unit": "편",
        "label": "참여한 영화"
      },
      {
        "value": "auto:stages",
        "unit": "편",
        "label": "제작 중인 영화"
      }
    ]
  },
  "layout": [
    {
      "id": "youtube",
      "show": true
    },
    {
      "id": "outsource",
      "show": true
    },
    {
      "id": "film",
      "show": true
    },
    {
      "id": "dasi",
      "show": true
    },
    {
      "id": "edit",
      "show": true
    },
    {
      "id": "contact",
      "show": true
    }
  ],
  "youtube": {
    "en": "YOUTUBE",
    "badge": "MAIN",
    "title": "유튜브",
    "desc": "제일 많이, 제일 즐겁게 하는 일.\n직접 기획하고 찍고 편집합니다.",
    "channel": {
      "name": "카워드 스튜디오",
      "handle": "@c_ward",
      "tagline": "잘 짖고, 잘 놀고, 잘 만듭니다.",
      "desc": "기획부터 촬영, 편집까지\n혼자서 끝까지 만드는 채널입니다.",
      "url": "https://www.youtube.com/@c_ward",
      "avatar": "https://yt3.googleusercontent.com/vHPkuUp-OIPEEnbO4nkOg0arKz2vWY3r1pCbp-fnjRpDZTzMjaLrCwsMtdXS0zif0zz71Y4Mag=s240-c-k-c0x00ffffff-no-rj",
      "button": "채널 방문하기"
    },
    "videos": [
      {
        "title": "이게 뭔 스킨이야",
        "id": "C0VnVbcB8-g"
      },
      {
        "title": "한국인이 아시아 섭 하면 생기는 일",
        "id": "HX09tGF0QPc"
      },
      {
        "title": "여기가 야시장 맛집이라면서요?",
        "id": "uZQ9S8cRW5I"
      },
      {
        "title": "롤 좋아하는 친구들이랑 볼링 치러가면 생기는 일",
        "id": "Ih2qKrALhaI"
      }
    ]
  },
  "outsource": {
    "en": "OUTSOURCING",
    "badge": "WORK",
    "title": "외부 작업",
    "desc": "의뢰받아 함께 만든 작업들입니다.\n맡긴 분이 그린 장면이 그대로 나오도록 만듭니다.",
    "works": [
      {
        "title": "십세들 EP.17",
        "client": "THE SMC 그룹 · 프로젝트 채널 '십세들'",
        "year": "",
        "role": "음향감독",
        "desc": "1020 코덕들이 파우치를 탈탈 털어 보는 편.\n여러 명이 한꺼번에 이야기하는 현장에서\n목소리 하나하나가 또렷하게 들리도록 챙겼습니다.",
        "link": "https://www.youtube.com/watch?v=ZFlZpd5XYos"
      },
      {
        "title": "십세들 EP.06",
        "client": "THE SMC 그룹 · 프로젝트 채널 '십세들'",
        "year": "",
        "role": "음향감독",
        "desc": "10대가 부모님과 싸우는 이유를 털어놓는 편.\n솔직한 이야기가 잡음에 묻히지 않도록\n현장의 소리를 책임졌습니다.",
        "link": "https://www.youtube.com/watch?v=7iflRv-mVeo"
      },
      {
        "title": "NAPKO × SSRC 친해지기 ep.4",
        "client": "SSRC 청소년 로봇대회 · 팀 NAPKO",
        "year": "2026",
        "role": "마케팅 · SNS 운영",
        "desc": "대회에 나온 모든 팀을 찾아가 인사하는 숏폼.\n팀 SNS에서 가장 많이 본 영상입니다. (조회수 1.3천)\n이 마케팅 활동으로 마케팅 부문 2위를 받았습니다.",
        "link": "https://www.youtube.com/shorts/C06eM7JAXJA"
      },
      {
        "title": "welcome to NAPKO!",
        "client": "SSRC 청소년 로봇대회 · 팀 NAPKO",
        "year": "2026",
        "role": "마케팅 · SNS 운영",
        "desc": "팀을 처음 소개한 채널 첫 영상.\n유튜브 영상 22개와 인스타그램 게시물 36개를\n직접 기획하고 운영했습니다.",
        "link": "https://www.youtube.com/watch?v=KVgNlGrf-B0"
      }
    ]
  },
  "film": {
    "en": "FILM",
    "badge": "SUB",
    "title": "영화",
    "desc": "연출, 촬영, 음향, 배우까지.\n현장의 여러 자리에서 영화를 만들어 왔습니다.",
    "picksTitle": "대표작",
    "picks": [
      {
        "title": "영상고 옥상엔 요술램프가 있다!",
        "sub": "26 SVMHS 뮤지컬",
        "year": "2026",
        "role": "음향",
        "desc": "",
        "video": ""
      },
      {
        "title": "Mon ange!",
        "sub": "나의 작은 천사",
        "year": "2026",
        "role": "제작부",
        "desc": "",
        "video": ""
      },
      {
        "title": "",
        "sub": "",
        "year": "",
        "role": "",
        "desc": "",
        "video": ""
      }
    ],
    "films": [
      {
        "title": "초록의 허상",
        "year": 2026,
        "roles": [
          "음향"
        ],
        "records": [],
        "note": "프리 프로덕션 진행 중"
      },
      {
        "title": "불어터진 고백",
        "year": 2026,
        "roles": [
          "음향"
        ],
        "records": [],
        "note": "프리 프로덕션 진행 중"
      },
      {
        "title": "Monage!",
        "year": 2026,
        "roles": [
          "프로듀서",
          "라인프로듀서",
          "제작부"
        ],
        "records": []
      },
      {
        "title": "혈모양처",
        "year": 2026,
        "roles": [
          "배우"
        ],
        "records": []
      },
      {
        "title": "끝과 시작 사이, 서울",
        "year": 2026,
        "roles": [
          "음향"
        ],
        "records": []
      },
      {
        "title": "이륙!",
        "year": 2026,
        "roles": [
          "연출"
        ],
        "records": []
      },
      {
        "title": "黃昏(황혼)",
        "year": 2026,
        "roles": [
          "연출"
        ],
        "records": []
      },
      {
        "title": "아빠의 방식",
        "year": 2026,
        "roles": [
          "프로듀서"
        ],
        "records": []
      },
      {
        "title": "Emotion Store",
        "year": 2026,
        "roles": [
          "제작부"
        ],
        "records": []
      },
      {
        "title": "성장통",
        "year": 2026,
        "roles": [
          "촬영부"
        ],
        "records": []
      },
      {
        "title": "영상고 옥상엔 요술램프가 있다! (26 SVMHS 뮤지컬)",
        "year": 2026,
        "roles": [
          "음향"
        ],
        "records": []
      },
      {
        "title": "읽음",
        "year": 2026,
        "roles": [
          "연출"
        ],
        "records": []
      },
      {
        "title": "빨래방",
        "year": 2026,
        "roles": [
          "프로듀서"
        ],
        "records": []
      },
      {
        "title": "내가 사랑하는 사람",
        "year": 2026,
        "roles": [
          "프로듀서"
        ],
        "records": []
      },
      {
        "title": "헤드 퍼스트 슬라이딩",
        "year": 2026,
        "roles": [
          "제작부"
        ],
        "records": []
      },
      {
        "title": "나는 오늘!!",
        "year": 2026,
        "roles": [
          "촬영부",
          "조명부"
        ],
        "records": []
      },
      {
        "title": "아트필름 홍보영상",
        "year": 2026,
        "roles": [
          "촬영부",
          "편집"
        ],
        "records": []
      },
      {
        "title": "사랑의 색체",
        "year": 2026,
        "roles": [
          "제작부"
        ],
        "records": []
      },
      {
        "title": "유흔",
        "year": 2025,
        "roles": [
          "연출부"
        ],
        "records": []
      },
      {
        "title": "땅볼아웃",
        "year": 2025,
        "roles": [
          "배우"
        ],
        "records": []
      },
      {
        "title": "Scholl Of Roll (25 SVMHS 뮤지컬)",
        "year": 2025,
        "roles": [
          "배우"
        ],
        "records": []
      },
      {
        "title": "무제-Untitled",
        "year": 2025,
        "roles": [
          "프로듀서",
          "미술"
        ],
        "records": []
      },
      {
        "title": "비밀하나",
        "year": 2025,
        "roles": [
          "제작부"
        ],
        "records": []
      },
      {
        "title": "도박 중독 예방 광고",
        "year": 2025,
        "roles": [
          "음향"
        ],
        "records": []
      },
      {
        "title": "작은 불씨",
        "year": 2025,
        "roles": [
          "음향"
        ],
        "records": []
      },
      {
        "title": "적반하장",
        "year": 2025,
        "roles": [
          "배우"
        ],
        "records": []
      },
      {
        "title": "Awaken The Bull",
        "year": 2025,
        "roles": [
          "연출",
          "촬영"
        ],
        "records": []
      },
      {
        "title": "환생검문소",
        "year": 2025,
        "roles": [
          "음향"
        ],
        "records": []
      },
      {
        "title": "자화상",
        "year": 2025,
        "roles": [
          "촬영",
          "편집"
        ],
        "records": []
      }
    ]
  },
  "dasi": {
    "en": "NOW MAKING",
    "badge": "MY FILM",
    "title": "다시, 변신",
    "desc": "지금, 이런 영화를\n만들고 있습니다.",
    "kind": "단편 영화",
    "director": "김민서",
    "video": "",
    "role": "연출 · 각본",
    "status": "프리 프로덕션 · 시놉시스 작업 중",
    "logline": "꿈을 내려놓으려던 스물일곱 살 준화가\n아직 히어로를 꿈꾸는 고등학생 태상을 만나\n잊고 있던 선의를 다시 꺼내는 이야기.",
    "note": "세상을 바꾸는 건 거창한 신념이 아니라\n누군가를 향한 사소한 손짓일지도 모릅니다.",
    "people": [
      {
        "name": "준화",
        "desc": "꿈을 내려놓으려던 스물일곱 살"
      },
      {
        "name": "태상",
        "desc": "아직 히어로를 꿈꾸는 고등학생"
      }
    ],
    "stage": "pre",
    "steps": {
      "pre": [
        {
          "name": "시놉시스",
          "state": "now"
        },
        {
          "name": "시나리오",
          "state": "todo"
        },
        {
          "name": "캐스팅 · 장소 섭외",
          "state": "todo"
        }
      ],
      "prod": [
        {
          "name": "촬영",
          "state": "todo"
        }
      ],
      "post": [
        {
          "name": "편집",
          "state": "todo"
        },
        {
          "name": "사운드 · 색보정",
          "state": "todo"
        },
        {
          "name": "완성 · 상영",
          "state": "todo"
        }
      ]
    }
  },
  "edit": {
    "en": "FOOTPRINT",
    "badge": "SUB",
    "title": "발자취",
    "desc": "취미로 시작한 편집이\n하나의 길이 되기까지.",
    "years": "8",
    "eyebrow": "VIDEO EDITOR",
    "name": "영상 편집자, 김민서.",
    "tools": [
      {
        "short": "Pr",
        "name": "Premiere Pro",
        "role": "컷 편집 · 자막 · 사운드"
      },
      {
        "short": "Ae",
        "name": "After Effects",
        "role": "모션그래픽 · 타이틀"
      },
      {
        "short": "Ps",
        "name": "Photoshop",
        "role": "썸네일 · 이미지"
      },
      {
        "short": "Ai",
        "name": "Illustrator",
        "role": "로고 · 그래픽"
      }
    ],
    "hint": "재생선을 움직이면 해마다의 발자취를 볼 수 있어요.",
    "lead": "편집은 촬영이 끝난 뒤에 시작되는\n두 번째 연출이라고 생각해요.\n유튜브의 빠른 호흡부터 단편 영화의 긴 여운까지,\n찍어둔 장면이 가장 잘 보이는 순서를\n8년째 찾고 있습니다.",
    "timeline": {
      "name": "MS_발자취_2022-2026",
      "years": [
        "2022 이전",
        "2023",
        "2024",
        "2025",
        "2026"
      ],
      "tracks": [
        "V3",
        "V2",
        "V1",
        "A1",
        "A2"
      ],
      "clips": [
        {
          "track": "V1",
          "from": 1,
          "to": 1,
          "main": true,
          "title": "기술과 편집의 확장",
          "desc": "방송부 내에서 담당 직책을 엔지니어로 변경하며 방송 장비와 영상 기술 분야에 관심을 넓혀 나갔습니다.\n카메라와 음향 장비를 비롯한 방송 시스템을 직접 다루며 기술적인 역량을 쌓았고, 기존에 가지고 있던 영상 편집 능력도 한층 발전시켰습니다.\n\n또한 학생회에서 제작하는 각종 영상을 전문적으로 편집하며 교내 프로젝트에 참여했고, 이를 계기로 외부 편집 의뢰까지 맡게 되었습니다. 취미로 시작했던 영상 편집이 하나의 전문적인 역량이자 활동 영역으로 발전하기 시작한 시기였습니다."
        },
        {
          "track": "V2",
          "from": 1,
          "to": 1,
          "title": "방송부 엔지니어",
          "desc": ""
        },
        {
          "track": "A1",
          "from": 1,
          "to": 1,
          "title": "학생회 영상 · 외부 편집 의뢰",
          "desc": ""
        },
        {
          "track": "V1",
          "from": 2,
          "to": 2,
          "main": true,
          "title": "더 큰 무대를 향하여",
          "desc": "교내 축제 영상과 졸업 영상 등 이전보다 규모가 크고 다양한 목적을 가진 영상 프로젝트를 제작하기 시작했습니다.\n개인적인 영상 제작을 넘어 여러 사람의 의견을 조율하고, 하나의 결과물을 완성하기까지 필요한 과정들을 경험하며 제작자로서의 시야를 넓혔습니다.\n\n특히 영상 콘텐츠가 단순한 창작물을 넘어 하나의 브랜드와 산업으로 성장할 수 있다는 점에 주목하게 되었습니다. 이를 계기로 콘텐츠 제작뿐만 아니라 크리에이터의 성장과 활동을 지원하고 다양한 콘텐츠 사업을 이끄는 MCN 기업에 관심을 갖게 되었으며, 장기적으로 크리에이터 MCN 기업의 대표이사가 되겠다는 새로운 목표를 세우게 되었습니다."
        },
        {
          "track": "V2",
          "from": 2,
          "to": 2,
          "title": "축제 · 졸업 영상",
          "desc": ""
        },
        {
          "track": "V3",
          "from": 2,
          "to": 4,
          "title": "목표: MCN 대표이사",
          "desc": ""
        },
        {
          "track": "V1",
          "from": 3,
          "to": 3,
          "main": true,
          "title": "새로운 시작, 서울영상고등학교",
          "desc": "서울영상고등학교에 진학하며 영상 제작자로서 한 단계 더 성장할 수 있는 새로운 환경을 만나게 되었습니다.\n교내 영화 동아리에 가입하여 다양한 독립영화 제작에 참여했으며, 여러 부서와 협업하며 영화가 완성되는 전반적인 제작 과정을 경험했습니다.\n\n또한 The SMC Group의 프로젝트 **'십세들'**에서 음향감독으로 활동하며 전문적인 영상 제작 현장을 경험했습니다.\n이와 함께 약 20만 명의 구독자를 보유한 유튜브 크리에이터 **'호영숏츠'**의 콘텐츠 기획과 대본 작성을 담당하며 영상 제작을 넘어 콘텐츠의 방향성과 시청자에게 전달할 메시지를 고민하는 경험도 쌓았습니다.\n\n이 시기를 통해 영상 제작, 기술, 콘텐츠 기획이라는 세 가지 영역을 아우르는 역량을 갖추기 위해 노력하기 시작했습니다."
        },
        {
          "track": "V2",
          "from": 3,
          "to": 3,
          "title": "영화 동아리 · 독립영화",
          "desc": ""
        },
        {
          "track": "A1",
          "from": 3,
          "to": 3,
          "title": "십세들 음향감독",
          "desc": ""
        },
        {
          "track": "A2",
          "from": 3,
          "to": 3,
          "title": "호영숏츠 기획 · 대본",
          "desc": ""
        },
        {
          "track": "V1",
          "from": 4,
          "to": 4,
          "main": true,
          "title": "경험을 넘어, 전문성으로",
          "desc": "그동안 쌓아 온 경험을 바탕으로 독립영화 현장에서 프로듀서와 음향감독으로 활동하며 제작 전반과 후반 작업에 대한 이해를 넓혀 나갔습니다.\n특히 2026년에는 <영상고 옥상엔 요술램프가 있다!>와 〈Mon Ange!〉에 참여하며 보다 큰 규모의 작품 제작을 경험했습니다. 다양한 부서와 인원이 함께하는 현장에서 협업의 중요성과 프로덕션 운영의 복잡성을 직접 체감하며 한층 성장할 수 있었습니다.\n\n또한 SSRC 청소년 로봇대회에서 NAPKO 팀의 마케팅 부서로 활동하며 기존의 영상 제작 분야에서 벗어나 새로운 영역에 도전했습니다. 팀의 홍보와 마케팅 활동에 참여했으며, 그 결과 SSRC 청소년 로봇대회 마케팅 부문 2위라는 성과를 거두었습니다."
        },
        {
          "track": "V2",
          "from": 4,
          "to": 4,
          "title": "요술램프 · Mon Ange!",
          "desc": ""
        },
        {
          "track": "A1",
          "from": 4,
          "to": 4,
          "title": "프로듀서 · 음향감독",
          "desc": ""
        },
        {
          "track": "A2",
          "from": 4,
          "to": 4,
          "title": "NAPKO 마케팅 2위",
          "desc": ""
        }
      ]
    }
  },
  "contact": {
    "en": "CONTACT",
    "title": "함께 만들어요",
    "clientEyebrow": "FOR CLIENTS",
    "clientTitle": "작업 의뢰",
    "clientDesc": "유튜브 영상 편집, 촬영, 단편 영화 작업이 필요하다면\n편하게 연락 주세요.",
    "email": "eddy0730@naver.com",
    "instagramUrl": "https://www.instagram.com/ms_xy.0/",
    "viewerEyebrow": "FOR VIEWERS",
    "viewerTitle": "카워드 스튜디오",
    "viewerDesc": "새 영상은\n유튜브에 가장 먼저 올라갑니다.",
    "viewerLink": "채널 구독하러 가기"
  },
  "footer": {
    "info": "유튜브 · 영화 · 편집",
    "info2": "YouTube 카워드 스튜디오 @c_ward",
    "address": "서울특별시 양천구 목동로11길 46 (신정동)",
    "copyright": "© 2026 MS Portfolio. All rights reserved."
  }
};
