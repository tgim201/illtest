/**
 * quests.js - 문해력 및 정보 리터러시 진단 시나리오 및 문제 데이터셋
 * 
 * [측정 프레임워크 기준]
 * 1. PISA 독해 문해력:
 *    - access: 정보 접근 및 검색 (Locate information / Access & Retrieve)
 *    - integrate: 이해 및 통합 (Understand / Integrate & Generate Inferences)
 *    - evaluate: 평가 및 숙고 (Evaluate & Reflect)
 * 
 * 2. Big 6 Skills 정보 리터러시:
 *    - task_def: 1. 과제 정의 (Task Definition)
 *    - seeking_strat: 2. 정보 탐색 전략 (Information Seeking Strategies)
 *    - location_access: 3. 위치 파악 및 접근 (Location and Access)
 *    - use_info: 4. 정보 활용 (Use of Information)
 *    - synthesis: 5. 종합 및 통합 (Synthesis)
 *    - evaluation: 6. 평가 (Evaluation)
 * 
 * 문제를 수정하거나 새 시나리오를 추가하려면 이 객체의 내용을 수정하세요.
 */

const QUEST_DATA = {
    meta: {
        title: "미스터리 팩트체크 수사대 : 코드 I.L.L.",
        subtitle: "PISA 문해력 & Big 6 Skills 정보 리터러시 진단 게임",
        timeLimitSeconds: 300, // 5분 (300초)
        schoolTarget: "중학생 (1~3학년)",
        introStory: {
            briefingTitle: "긴급 수사 의뢰서 : 상록중 급식 괴소문 사건",
            briefingText: "상록중학교 축제 전날, 학생 익명 커뮤니티에 '내일 급식 카레에 학생들을 조종하는 액체 나노로봇이 투입된다! 절대 먹지 마라!'는 괴소문 영상과 자극적인 글이 폭발적으로 퍼져 전교가 패닉에 빠졌습니다.\n\n학교 축제가 취소될 위기에서 학생회와 선생님들은 특별 청소년 수사관인 당신에게 사건의 진실을 밝혀달라고 의뢰했습니다.\n\n제한 시간은 5분! 단서를 찾고, 가짜뉴스를 판별하여 진실 보고서를 완성하세요!"
        }
    },

    missions: [
        /* ============================================================
           MISSION 1 : 사건 브리핑 정밀 분석 (과제 정의 & 정보 탐색 전략)
           ============================================================ */
        {
            id: 1,
            stageName: "MISSION 1",
            title: "의뢰서 분석 및 수사 계획 수립",
            subtitle: "핵심 과제(Task)를 정의하고 최적의 탐색 전략을 세우세요.",
            skillBadges: ["PISA 정보접근", "Big6 과제정의", "Big6 탐색전략"],
            type: "quiz_multi",
            storyPrompt: "의뢰서 텍스트와 익명 게시글 캡처를 정밀하게 분석하여 수사의 방향을 잡아야 합니다.",
            document: {
                badge: "익명 커뮤니티 제보 캡처",
                content: "제목: [충격실화] 내일 급식 먹으면 큰일납니다 ㄷㄷ\n작성자: 익명 수호자 | 조회수: 4,821 | 좋아요: 988\n\n'오늘 오후 본관 1층 과학실 복도에 [나노 캡슐]이라고 적힌 수상한 택배 상자 3개가 쌓여있는 걸 내가 직접 봄!! 영양실 쪽으로 배달되던데 내일 급식에 뇌파 조종 나노로봇 타는 게 확실함. 친구들한테 빨리 이 글 공유해서 내일 급식 파업하자 ㅠㅠ'"
            },
            questions: [
                {
                    qId: "m1_q1",
                    question: "Q1. 이번 사건에서 수사관인 당신이 가장 먼저 해결해야 할 '핵심 과제(Task)'는 무엇인가요?",
                    hint: "소문의 감정적 파장보다 주장의 사실 여부를 규명하는 것이 먼저입니다.",
                    options: [
                        { text: "전교생에게 급식을 먹지 말라고 학교 방송으로 긴급 공지한다.", score: {} },
                        { text: "택배 상자의 실제 정체와 '급식 투입설'의 사실 여부를 검증한다.", score: { pisa_access: 20, big6_task_def: 50 }, correct: true },
                        { text: "익명 작성자의 스마트폰 IP를 즉시 추적하여 처벌한다.", score: {} },
                        { text: "내일 급식 메뉴를 빵과 우유로 교체해 달라고 영양사님께 건의한다.", score: {} }
                    ]
                },
                {
                    qId: "m1_q2",
                    question: "Q2. 이 괴소문의 진실을 밝히기 위해 교내 데이터망에 입력할 '가장 효과적인 검색어 조합'은 무엇인가요?",
                    hint: "감정적인 단어(충격, 조종)보다 객관적인 사건 단서(택배, 과학실, 납품)를 조합해야 합니다.",
                    options: [
                        { text: "나노로봇 인류 멸망 딥페이크 모음", score: {} },
                        { text: "상록중학교 축제 괴담 레전드 썰", score: {} },
                        { text: "과학실 택배 수령 대장 축제 비타민 실험 교구 납품", score: { pisa_access: 20, big6_seeking_strat: 50 }, correct: true },
                        { text: "중학교 급식 카레 맛있게 만드는 비법", score: {} }
                    ]
                }
            ]
        },

        /* ============================================================
           MISSION 2 : 디지털 포털 피드 탐색 (위치 파악 및 접근)
           ============================================================ */
        {
            id: 2,
            stageName: "MISSION 2",
            title: "디지털 검색망 필터링",
            subtitle: "방대한 포털 피드 속에서 진짜 단서가 되는 2개의 신뢰성 있는 자료를 수사 수첩에 스크랩하세요.",
            skillBadges: ["PISA 위치파악", "Big6 위치접근", "Big6 정보활용"],
            type: "feed_select",
            requiredCount: 2,
            storyPrompt: "학교 포털과 SNS 검색창에 '상록중 나노 택배 급식'을 검색했습니다. 쏟아지는 결과 중 객관적이고 신뢰할 수 있는 단서 2개를 선택하세요.",
            items: [
                {
                    itemId: "feed_1",
                    source: "찌라시 이슈 채널 (개인 SNS)",
                    trustLevel: "low",
                    title: "🚨 상록중 충격 속보! 뇌를 조종하는 로봇 급식 유출 의혹 (영상)",
                    snippet: "소문의 진위는 알 수 없으나 네티즌들은 충격에 휩싸였습니다. 좋아요 누르면 나노로봇 면역 영양제 50% 할인 쿠폰 증정!",
                    isEvidence: false,
                    feedbackReason: "조회수와 광고 수익을 노린 출처 불분명의 자극적 클릭베이트입니다."
                },
                {
                    itemId: "feed_2",
                    source: "상록중 행정실 공식 물품 수령 대장",
                    trustLevel: "high",
                    title: "📦 [공식 문서] 10월 14일 과학동아리 축제 교구 택배 수령 기록",
                    snippet: "수령자: 과학부 지도교사 / 품명: [축제 체험부스용] 식용 비타민 나노입자 캡슐 제조 실험 키트 3박스 / 보관장소: 본관 1층 과학실",
                    isEvidence: true,
                    feedbackReason: "택배 상자의 실제 내용물(식용 비타민 실험 키트)을 증명하는 결정적 공문서 단서입니다."
                },
                {
                    itemId: "feed_3",
                    source: "모 유튜브 음모론 채널",
                    trustLevel: "low",
                    title: "외계 문명이 학교 급식에 침투하는 7가지 시그널",
                    snippet: "카레 색깔이 노란 이유는 나노 분말을 숨기기 위해서입니다. 비밀 정부 조직의 계획을 폭로합니다.",
                    isEvidence: false,
                    feedbackReason: "비과학적 음모론이며 어떠한 객관적 사실도 포함되어 있지 않습니다."
                },
                {
                    itemId: "feed_4",
                    source: "상록중 영양상담실 식재료 검수 일지",
                    trustLevel: "high",
                    title: "📋 [급식 안전] 10월 15일 축제일 식재료 입고 및 안전 검수 완료 보고서",
                    snippet: "납품처: 친환경 학교급식 지원센터 / 검수 결과: 감자, 양파, 돼지고기 전량 1등급 친환경 인증. 외부 가공 나노 물질 반입 일체 없음.",
                    isEvidence: true,
                    feedbackReason: "급식에 외부 물질이 투입되지 않았음을 공식 검증하는 신뢰성 높은 1차 자료입니다."
                },
                {
                    itemId: "feed_5",
                    source: "익명 오픈채팅방 대화 캡처",
                    trustLevel: "low",
                    title: "누가 카레 먹고 로봇 소리 냈다는 게 진짜임??",
                    snippet: "옆 반 누구누구가 삐리삐리 소리 냈다는데 레알인가요? 내일 급식 다들 버립시다.",
                    isEvidence: false,
                    feedbackReason: "전형적인 '카더라' 통신으로 확인되지 않은 풍문에 불과합니다."
                }
            ],
            scoring: {
                correctItemIds: ["feed_2", "feed_4"],
                pisa_access: 30,
                big6_location_access: 50,
                big6_use_info: 30
            }
        },

        /* ============================================================
           MISSION 3 : 교차 검증 연구실 (텍스트 이해 및 통합 추론)
           ============================================================ */
        {
            id: 3,
            stageName: "MISSION 3",
            title: "교차 검증 연구실",
            subtitle: "수집된 서로 다른 문서를 교차 비교하여 논리적 모순과 행간의 진실을 추론하세요.",
            skillBadges: ["PISA 이해·통합", "Big6 정보활용", "Big6 종합"],
            type: "quiz_multi",
            storyPrompt: "수사관 수첩에 스크랩된 3가지 문서를 나란히 놓고 대조 분석합니다.",
            documents: [
                {
                    docName: "문서 A: 익명 제보글의 주장",
                    body: "1) 과학실 앞 복도에 '나노'라고 적힌 택배가 있었다.\n2) 그 택배는 분명 급식실로 옮겨져 카레에 살포될 것이다."
                },
                {
                    docName: "문서 B: 과학동아리 지도교사 인터뷰",
                    body: "'축제 때 전교생에게 비타민 C 캡슐을 직접 만들어보는 체험을 하려고 [식용 비타민 나노입자] 키트를 주문했습니다. 인체에 무해한 비타민 분말이며 과학실에 안전하게 보관 중입니다.'"
                },
                {
                    docName: "문서 C: 영양교사 확인서",
                    body: "'급식실은 외부인의 출입이 엄격히 통제되며, 등록된 유기농 식자재 공급 업체의 식재료만 입고됩니다. 과학실 물품이 급식실로 들어오는 것은 시스템상 불가능합니다.'"
                }
            ],
            questions: [
                {
                    qId: "m3_q1",
                    question: "Q1. 문서 A와 문서 B, C를 교차 대조했을 때, 익명 제보자의 주장에서 나타난 '가장 심각한 논리적 왜곡'은 무엇인가요?",
                    hint: "실제로 본 것(상자 겉면 단어)과 본인이 멋대로 상상한 것(급식 살포)을 구분해보세요.",
                    options: [
                        { text: "비타민 나노입자가 과학실에 보관되어 있다는 사실을 누락했다.", score: {} },
                        { text: "실험용 교구 상자의 '나노'라는 글자만 보고, 급식에 학생 조종 물질로 쓰일 것이라 섣부른 비약을 저질렀다.", score: { pisa_integrate: 25, big6_use_info: 30 }, correct: true },
                        { text: "급식 카레에 양파가 들어가지 않는다고 오해했다.", score: {} },
                        { text: "과학동아리 학생들의 성적이 우수하다고 착각했다.", score: {} }
                    ]
                },
                {
                    qId: "m3_q2",
                    question: "Q2. 세 문서를 종합하여 도출할 수 있는 가장 합리적인 '사건의 전말'은 무엇인가요?",
                    hint: "상황의 원인과 결과, 오해의 발생 지점을 포괄하는 보기를 선택하세요.",
                    options: [
                        { text: "실제로 뇌 조종 실험이 진행 중이었으나 교사들이 이를 은폐하고 있다.", score: {} },
                        { text: "축제 체험용 무해한 '비타민 나노 키트' 배송을 목격한 학생이 공포심과 자극적인 상상력을 보태 퍼뜨린 오해이다.", score: { pisa_integrate: 25, big6_synthesis: 30 }, correct: true },
                        { text: "영양교사님이 과학동아리 부스를 위해 카레를 지원하기로 약속했다.", score: {} },
                        { text: "익명 제보자는 학교 축제를 정상적으로 즐기기 위해 글을 썼다.", score: {} }
                    ]
                }
            ]
        },

        /* ============================================================
           MISSION 4 : 가짜뉴스 & 편향 판독기 (평가 및 숙고)
           ============================================================ */
        {
            id: 4,
            stageName: "MISSION 4",
            title: "팩트체크 스캐너 (평가 및 숙고)",
            subtitle: "정보의 출처와 논리성을 비판적으로 검토하여 [팩트(사실)] / [왜곡·과장] / [허위·낚시]로 판정하세요.",
            skillBadges: ["PISA 평가·숙고", "Big6 정보활용", "Big6 평가"],
            type: "fact_checker",
            storyPrompt: "사건과 관련해 떠도는 4개의 진술을 팩트체크 스캐너로 판별하세요. 각 진술의 성격을 정확하게 분류해야 왜곡된 정보의 전파를 막을 수 있습니다.",
            statements: [
                {
                    sId: "s1",
                    text: "\"10월 14일 상록중학교 본관 1층으로 '나노'라는 글자가 인쇄된 택배 박스들이 배송되었다.\"",
                    correctType: "fact",
                    reason: "행정실 수령 대장과 과학실 교구 목록에서 확인된 객관적 사실(Fact)입니다."
                },
                {
                    sId: "s2",
                    text: "\"그 나노로봇은 학생들의 뇌파를 조종하여 학교 규칙에만 복종하게 만드는 비밀 무기이다.\"",
                    correctType: "fake",
                    reason: "과학적 근거와 공인된 사실이 전혀 없는 터무니없는 허위·날조(Fake)입니다."
                },
                {
                    sId: "s3",
                    text: "\"해당 제보글에 댓글이 500개나 달리고 모두가 공포에 떨고 있으니 이 정보는 100% 진실이다.\"",
                    correctType: "distortion",
                    reason: "많은 사람의 감정적 동조나 반응 수가 정보의 참/거짓을 결정하지 못하는 대중심리 오류(왜곡·과장)입니다."
                },
                {
                    sId: "s4",
                    text: "\"이 경고를 친구 10명에게 전달하지 않으면 당신의 뇌세포도 곧 파괴될 것입니다.\"",
                    correctType: "fake",
                    reason: "전형적인 공포 유발형 체인레터 피싱/허위 낚시(Fake) 문구입니다."
                }
            ],
            typeOptions: [
                { key: "fact", label: "✅ 팩트 (검증된 사실)" },
                { key: "distortion", label: "⚠️ 왜곡·과장 (논리적 오류)" },
                { key: "fake", label: "❌ 허위·낚시 (근거없는 거짓)" }
            ],
            scoring: {
                perCorrect: {
                    pisa_evaluate: 25, // 총 100
                    big6_evaluation: 15,
                    big6_use_info: 10
                }
            }
        },

        /* ============================================================
           MISSION 5 : 최종 진실 브리핑 보고서 (종합 & 메타 평가)
           ============================================================ */
        {
            id: 5,
            stageName: "MISSION 5",
            title: "사건 종결 진실 브리핑",
            subtitle: "수집한 모든 정보와 단서를 종합하여 최종 수사 보고서를 완성하고 성찰하세요.",
            skillBadges: ["PISA 종합결론", "Big6 종합", "Big6 메타평가"],
            type: "synthesis_report",
            storyPrompt: "전교생과 교직원에게 발표할 최종 팩트체크 브리핑 문서의 핵심 요약문과 수사 성찰을 완성하세요.",
            blanks: [
                {
                    blankId: "b1",
                    label: "1. 소문의 발단",
                    promptText: "본 사건의 발단은 과학동아리의 축제 부스용 [ ___ 빈칸 1 ___ ] 배송 상자를 본 학생의 착각에서 시작되었습니다.",
                    options: [
                        { text: "국가 기밀 사이버 조종 장치", correct: false },
                        { text: "인체 무해한 식용 비타민 나노입자 키트", correct: true },
                        { text: "수입산 불량 불량식품 원료", correct: false }
                    ]
                },
                {
                    blankId: "b2",
                    label: "2. 급식과의 관련성",
                    promptText: "영양교사의 식자재 검수 일지와 출입 관리 대장을 대조 검증한 결과, 해당 물품과 학교 급식은 [ ___ 빈칸 2 ___ ] 으로 확인되었습니다.",
                    options: [
                        { text: "전혀 무관하며 완벽하게 안전함", correct: true },
                        { text: "일부 조리 과정에 시험 투입됨", correct: false },
                        { text: "아직 확실히 알 수 없음", correct: false }
                    ]
                },
                {
                    blankId: "b3",
                    label: "3. 최종 조치 권고",
                    promptText: "따라서 학교 당국은 내일 예정된 과학축제를 [ ___ 빈칸 3 ___ ] 조치할 것을 수사관으로서 강력히 권고합니다.",
                    options: [
                        { text: "전면 취소하고 모든 학생을 귀가", correct: false },
                        { text: "정상 개최하고 전교생에게 팩트체크 해명 공지를 배포", correct: true },
                        { text: "일주일간 연기 후 군부대 조사 의뢰", correct: false }
                    ]
                }
            ],
            reflectionQuestion: {
                qId: "m5_reflect",
                question: "수사관 성찰: 이번 미션을 해결하며, 앞으로 SNS에서 충격적인 소식을 보았을 때 가장 먼저 실천해야 할 '정보 리터러시 태도'는 무엇인가요?",
                options: [
                    { text: "공포스럽거나 자극적인 글일수록 원문 출처와 공인된 증거를 다각도로 교차 검증한다.", correct: true, score: { pisa_evaluate: 25, big6_evaluation: 40 } },
                    { text: "친구들에게 먼저 단톡방으로 복사해 붙여넣고 반응을 살핀다.", correct: false, score: {} },
                    { text: "좋아요와 조회수가 1만 개를 넘은 게시물은 의심 없이 공유한다.", correct: false, score: {} },
                    { text: "인터넷은 온통 거짓말뿐이므로 어떤 뉴스나 공지도 아예 읽지 않는다.", correct: false, score: {} }
                ]
            },
            scoring: {
                perBlank: {
                    pisa_integrate: 15,
                    big6_synthesis: 25
                }
            }
        }
    ]
};
