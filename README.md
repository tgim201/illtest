# 🕵️ 미스터리 팩트체크 수사대 : 코드 I.L.L.
### (Mystery Fact-Check Agent: Code I.L.L.)

> **중학생을 위한 5분 게이미피케이션 기반 PISA 문해력 & Big 6 Skills 정보 리터러시 진단 웹 프로그램**

본 프로그램은 시험 형식을 부담스러워하는 중학생들이 흥미진진한 5분 추리 게임을 통해 자신의 **PISA 독해 문해력**과 **Big 6 Skills 정보 리터러시(Information Literacy)** 역량을 스스로 진단하고, 상세한 피드백을 받을 수 있도록 설계된 단일 웹 애플리케이션(SPA)입니다.

---

## 🌟 핵심 특징

1. **5분 몰입형 추리 게이미피케이션 (Gamification)**
   - 학교 축제를 위협하는 '급식 나노로봇 괴소문'의 진실을 파헤치는 학생 수사관 스토리.
   - 5개 미션별 인터랙션(의뢰서 분석, 포털 검색 피드 스크랩, 교차 검증, 팩트체크 스캐너, 최종 브리핑 퍼즐).
   - 5분 카운트다운 타이머 및 긴장감 넘치는 효과음(Web Audio API 내장, 음소거 토글 지원).

2. **국제 공인 측정 프레임워크 100% 매핑**
   - **PISA 2026 독해 문해력 3대 축**:
     - ① 정보 접근 및 검색 (Access and Retrieve)
     - ② 이해 및 통합 추론 (Integrate and Generate Inferences)
     - ③ 비판적 평가 및 숙고 (Evaluate and Reflect)
     - *PISA 공식 성취수준 Level 1 ~ Level 6 자동 환산 진단*
   - **Big 6 Skills 정보 문제해결 6대 요소**:
     - 1단계: 과제 정의 (Task Definition)
     - 2단계: 정보 탐색 전략 (Information Seeking Strategies)
     - 3단계: 위치 파악 및 접근 (Location and Access)
     - 4단계: 정보 활용 (Use of Information)
     - 5단계: 종합 및 통합 (Synthesis)
     - 6단계: 평가 및 성찰 (Evaluation)

3. **시각화 분석 리포트 & 데이터 관리**
   - HTML5 Canvas 기반의 **Big 6 다각형 레이더 차트** (외부 라이브러리 없이 100% 오프라인 구동).
   - 학생 맞춤형 강점 및 보완 가이드 제공.
   - **결과 인쇄 / PDF 저장**: `@media print` 최적화로 A4 1장에 단정하게 성적표 출력.
   - **교사용 CSV 성적 내보내기**: 반 학생들의 진단 결과를 엑셀(Excel)로 손쉽게 취합 및 분석 가능.

4. **100% 무설치 & 오프라인 완벽 구동**
   - 별도의 웹 서버나 Node.js, 외부 CDN 없이 브라우저에서 `index.html` 더블 클릭만으로 오프라인 완벽 실행.

---

## 📂 파일 구조

```
ill test/
├── index.html        # 메인 웹 애플리케이션 (인트로, 게임 화면, 진단 리포트)
├── README.md         # 프로젝트 안내 및 배포/수정 매뉴얼
├── css/
│   └── style.css     # 중학생 맞춤형 사이버네온 게이밍 UI, 반응형 & 인쇄 스타일
└── js/
    ├── quests.js     # 시나리오, 퀴즈, 선택지, PISA/Big 6 배점 데이터 (수정/확장 용이)
    ├── sound.js      # Web Audio API 기반 오프라인 사운드 신시사이저 엔진
    ├── report.js     # PISA 1~6 레벨 환산, Big 6 Canvas 레이더 차트, CSV 내보내기
    └── engine.js     # 5분 타이머, 미션 전환, 사용자 인터랙션 및 상태 관리
```

---

## 🚀 오프라인 실행 방법 (로컬 테스트)

1. `ill test` 폴더로 이동합니다.
2. `index.html` 파일을 더블 클릭하거나 마우스 우클릭 후 **Chrome / Edge / Safari / Whale** 브라우저로 엽니다.
3. 인터넷 연결이 없어도 사운드, 캔버스 차트, 게임 로직이 정상 작동합니다.

---

## 🌐 깃허브(GitHub) 탑재 및 배포 가이드 (GitHub Pages)

누구나 웹 링크로 접속해 게임을 플레이할 수 있도록 GitHub 무료 호스팅(GitHub Pages)을 지원합니다.

### 1단계: 깃허브 저장소(Repository) 생성
1. [GitHub](https://github.com/)에 로그인한 후 새 저장소(New repository)를 생성합니다.
   - Repository name: `middle-school-literacy-game` (또는 원하는 이름)
   - Public(공개) 선택
   - 'Create repository' 클릭

### 2단계: 소스코드 업로드
터미널(PowerShell 또는 Git Bash)에서 다음 명령어를 실행합니다:

```bash
cd "C:\Users\LISE-14\Desktop\ill test"

# Git 초기화 및 커밋
git init
git add .
git commit -m "feat: Initial commit of PISA & Big 6 literacy game"

# 원격 저장소 연결 (본인의 GitHub 주소 입력)
git branch -M main
git remote add origin https://github.com/<당신의-깃허브-아이디>/<저장소-이름>.git
git push -u origin main
```

*(Git 터미널 사용이 익숙하지 않은 경우, GitHub 웹사이트의 `Upload files` 버튼을 통해 `ill test` 안의 모든 파일과 폴더를 드래그 앤 드롭으로 업로드해도 됩니다.)*

### 3단계: GitHub Pages 무료 웹 배포 활성화
1. 저장소 상단의 **Settings** 메뉴로 이동합니다.
2. 좌측 메뉴에서 **Pages**를 클릭합니다.
3. **Build and deployment** 섹션의 Source를 **`Deploy from a branch`**로 설정합니다.
4. Branch를 **`main`** / **`/ (root)`** 로 선택하고 **Save**를 클릭합니다.
5. 1~2분 후 상단에 표시되는 배포 링크(예: `https://<아이디>.github.io/<저장소-이름>/`)로 접속하면 전 세계 어디서든 학생들이 웹으로 즉시 플레이할 수 있습니다.

---

## ✏️ 문제 및 시나리오 수정/추가 방법

선생님이 직접 새로운 퀘스트나 문제를 추가하거나 텍스트를 수정하려면 **[`js/quests.js`](file:///c:/Users/LISE-14/Desktop/ill%20test/js/quests.js)** 파일만 열어서 수정하시면 됩니다.

- **제한 시간 변경**: `QUEST_DATA.meta.timeLimitSeconds = 300` (초 단위 설정)
- **문항 추가/수정**: `QUEST_DATA.missions` 배열 내부의 각 미션 객체 수정
  - `question`: 질문 문장
  - `options`: 보기 목록 (`correct: true`로 정답 지정)
  - `score`: PISA 및 Big 6 배점 지정 (예: `{ pisa_access: 20, big6_task_def: 50 }`)
  - `hint`: 돋보기 힌트 문구

---

## 📊 측정 체계 및 진단 기준

### PISA 독해 성취 수준 (Proficiency Levels)
- **Level 6 (260~300점)**: 복합적 가짜뉴스와 편향을 날카롭게 꿰뚫어 보는 수석 프로파일러
- **Level 5 (220~259점)**: 상반된 문서 간의 논리적 모순을 훌륭히 찾아내는 특수 수사관
- **Level 4 (180~219점)**: 핵심 사실을 명확히 추출하고 왜곡을 안정적으로 구별하는 전문 분석관
- **Level 3 (140~179점)**: 직접 주어진 정보는 잘 찾으나 복합 추론 훈련이 필요한 주니어 수사관
- **Level 2 (100~139점)**: 출처의 객관성을 먼저 따져보는 비판적 독해 훈련이 필요한 수습 수사관
- **Level 1 (0~99점)**: 자극적 소문에 휩쓸리기 쉬워 기초 정보 탐색 습관 형성이 필요한 비기너
