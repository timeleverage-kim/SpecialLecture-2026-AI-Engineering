# AI와 함께하는 풀스택 개발 — 바이브코딩에서 그래프 엔지니어링까지

컴퓨터공학과 2학년 대상 특강 교안입니다. **3시간 × 9주(27시간)** 동안 TypeScript(React) + Spring Boot + MariaDB 기반 프로젝트 **"AI 스터디 플래너"** 를 만들며, AI 엔지니어링 6단계를 차례로 이해하고 실습으로 익힙니다.

```text
바이브코딩 → 프롬프트 → 컨텍스트 → 하네스 → 루프 → 그래프  (+ CI/CD·AWS, 한·일 README 포트폴리오)
```

## 주차별 구성

| 주차 | 주제 | 프로젝트에 추가되는 것 | Markdown | HTML |
|---|---|---|---|---|
| 1 | AI 엔지니어링 6단계 전체 지도 | 개발 환경 | [week01](docs/week01-overview.md) | [week01](html/week01-overview.html) |
| 2 | 바이브코딩 + Git·GitHub | 프로젝트 뼈대, D-Day 카운터 | [week02](docs/week02-vibe-coding.md) | [week02](html/week02-vibe-coding.html) |
| 3 | 프롬프트 엔지니어링 | 할 일·노트 CRUD, AI 노트 요약 | [week03](docs/week03-prompt-engineering.md) | [week03](html/week03-prompt-engineering.html) |
| 4 | 컨텍스트 엔지니어링 | `CLAUDE.md`, 설계 문서, 노트 RAG | [week04](docs/week04-context-engineering.md) | [week04](html/week04-context-engineering.html) |
| 5 | 하네스 엔지니어링 | 권한·Hooks·Skill·Subagent·MCP, 테스트, Docker, CI | [week05](docs/week05-harness-engineering.md) | [week05](html/week05-harness-engineering.html) |
| 6 | 루프 엔지니어링 | Stop Hook 검증 루프, AI 스터디 코치(Function Calling) | [week06](docs/week06-loop-engineering.md) | [week06](html/week06-loop-engineering.html) |
| 7 | 그래프 엔지니어링 | StateGraph 엔진, 학습계획 워크플로우 | [week07](docs/week07-graph-engineering.md) | [week07](html/week07-graph-engineering.html) |
| 8 | CI/CD 완성 | GitHub Actions → GHCR → AWS EC2 자동 배포 | [week08](docs/week08-cicd-aws.md) | [week08](html/week08-cicd-aws.html) |
| 9 | 포트폴리오 | 한국어 + 일본어 README, v1.0.0 릴리스, 발표·회고 | [week09](docs/week09-portfolio-readme.md) | [week09](html/week09-portfolio-readme.html) |

## 교안 구성 방식

매 주차는 **개념 설명 → 실습 → 정리·과제 → 진행 상황 & 다음 주 예고 → 일본 취업 IT 용어** 순서로 되어 있고, 실습은 아이콘으로 구분합니다.

| 표시 | 의미 |
|---|---|
| 🤖 Claude Code 프롬프트 | Claude Code 입력창에 붙여 넣을 지시문과 AI가 진행하는 과정 |
| ⌨️ 직접 실행 | 터미널에 직접 입력하는 명령 |
| ✅ 결과 확인 | 기대 출력·예시 화면으로 결과 비교 |
| 📄 참고 코드 | AI 결과와 비교할 기준 코드 (막히면 그대로 사용) |
| 📖 용어 풀이 | 처음 나오는 용어의 뜻·비유·사용 이유 |

결과 확인의 앱 화면 이미지(`docs/images/`)는 이해를 돕기 위한 **예시 화면(모의 데이터)** 입니다.

## 실습 기술 스택

| 영역 | 기술 |
|---|---|
| AI 코딩 도구 | Claude Code (`CLAUDE.md`, Hooks, Skill, Subagent, MCP, 헤드리스 모드) |
| 앱 내부 LLM | Google Gemini API 무료 등급 (기본 모델 `gemini-flash-lite-latest`, 환경 변수로 교체 가능) |
| Frontend | React + Vite + TypeScript, Vitest |
| Backend | Spring Boot 4 + Java 21, Spring Data JPA, JUnit 5 + H2 |
| DB | MariaDB 11.8 |
| DevOps | Git, GitHub, Docker Compose, GitHub Actions, GHCR, AWS EC2 |

## 폴더 구조

```text
.
├── docs/                 # 원본 교안 (Markdown) — GitHub·노션 업로드용
│   ├── week01 ~ week09
│   └── images/           # 결과 확인용 예시 화면
├── html/                 # 웹 교안 (HTML) — 브라우저로 열어서 수업
│   ├── index.html        # 과정 소개 · 주차 카드
│   ├── week01 ~ week09.html
│   ├── images/           # 빌드 시 docs/images에서 복사
│   └── assets/           # style.css, app.js
├── scripts/
│   └── build-html.mjs    # docs/*.md → html/*.html 변환
└── package.json
```

## HTML 교안 보기

`html/index.html`을 브라우저로 열면 됩니다. 그림(Mermaid), 수식(KaTeX), 코드 강조(highlight.js), 글꼴(Pretendard)은 CDN에서 불러오므로 **인터넷 연결이 필요**합니다.

GitHub Pages로 공개하려면: 저장소 **Settings → Pages → Branch: main / (root)** 로 설정하고 `https://<아이디>.github.io/<저장소>/html/` 로 접속합니다.

## Markdown을 수정한 뒤 HTML 다시 만들기

```bash
npm install
npm run build
```

`docs/`의 Markdown이 원본이고 `html/`은 빌드 결과물입니다. 내용 수정은 항상 `docs/`에서 합니다.

## 노션에 올리기

- 노션 페이지에서 **가져오기(Import) → Markdown & CSV** 로 `docs/weekXX-*.md` 파일을 주차별로 가져오면 표·코드 블록·수식 등이 대부분 노션 블록으로 변환됩니다. (변환 후 표와 수식은 한 번 훑어보며 확인하세요.)
- Mermaid 코드 블록은 노션에서 언어를 `Mermaid`로 두고 **미리보기(Preview)** 로 전환하면 그림으로 보입니다.

## 수업 전 확인할 것

- Gemini 무료 등급의 모델 이름과 한도는 자주 바뀝니다. 수업 전에 [Google AI Studio](https://aistudio.google.com)에서 확인하고 필요하면 `GEMINI_MODEL` 값을 바꾸세요.
- Claude Code는 Claude 유료 구독 또는 API 크레딧이 필요합니다. 구독이 없는 학생은 Gemini CLI 등 무료 대안 도구로 대부분의 실습을 따라 할 수 있습니다.
- AWS는 2025년 7월 15일 이후 가입 계정부터 크레딧 기반 프리 티어가 적용됩니다. 8주차 전에 학생 계정 상태와 예산 알림을 확인하세요.
- GitHub Actions 액션 버전(`@v5` 등)과 Spring Initializr 기본 버전은 시간이 지나면 올라갈 수 있습니다.
