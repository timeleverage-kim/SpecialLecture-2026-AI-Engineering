#!/usr/bin/env node
// docs/*.md → html/*.html 변환 스크립트
// 사용법: npm install && npm run build
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'html');

const COURSE = 'AI와 함께하는 풀스택 개발 — 바이브코딩에서 그래프 엔지니어링까지';

export const WEEKS = [
  { file: 'week01-overview.md', no: 1, title: 'AI 엔지니어링 6단계 전체 지도', short: '전체 지도', stage: '개요',
    desc: '바이브·프롬프트·컨텍스트·하네스·루프·그래프를 "천재 신입 인턴" 비유와 수식으로 한눈에 이해하고 개발 환경을 설치합니다.',
    tags: ['개념', '환경 설치', 'Claude Code', 'Gemini API'] },
  { file: 'week02-vibe-coding.md', no: 2, title: '바이브코딩 + Git·GitHub 기초', short: '바이브코딩', stage: '① 바이브',
    desc: '말로 프로젝트 뼈대(React·Spring Boot·MariaDB)를 만들고 D-Day 카운터로 바이브코딩의 속도와 함정을 체험합니다.',
    tags: ['Vite', 'Spring Initializr', 'Docker Compose', 'Git·PR'] },
  { file: 'week03-prompt-engineering.md', no: 3, title: '프롬프트 엔지니어링', short: '프롬프트', stage: '② 프롬프트',
    desc: '토큰·temperature 원리와 6요소 프롬프트를 익히고, 구조화된 지시로 CRUD API와 Gemini 노트 요약을 구현합니다.',
    tags: ['Few-shot', 'JSON 출력', 'CRUD', 'Gemini REST'] },
  { file: 'week04-context-engineering.md', no: 4, title: '컨텍스트 엔지니어링', short: '컨텍스트', stage: '③ 컨텍스트',
    desc: '토큰 예산과 Write·Select·Compress·Isolate 전략, CLAUDE.md, TF-IDF 기반 RAG로 "내 노트에서 답하기"를 만듭니다.',
    tags: ['CLAUDE.md', 'RAG', 'TF-IDF', '설계 문서'] },
  { file: 'week05-harness-engineering.md', no: 5, title: '하네스 엔지니어링', short: '하네스', stage: '④ 하네스',
    desc: '권한·Hooks·Skill·Subagent·MCP로 AI의 작업 환경을 만들고, 가짜 LLM 테스트·Docker·GitHub Actions CI를 구성합니다.',
    tags: ['Hooks', 'Skill', 'Subagent', 'JUnit·Vitest', 'CI'] },
  { file: 'week06-loop-engineering.md', no: 6, title: '루프 엔지니어링', short: '루프', stage: '⑤ 루프',
    desc: 'Stop Hook 검증 루프와 헤드리스 수정 루프, Gemini Function Calling으로 도구를 반복 호출하는 AI 스터디 코치를 구현합니다.',
    tags: ['ReAct', 'Function Calling', 'Stop Hook', 'claude -p'] },
  { file: 'week07-graph-engineering.md', no: 7, title: '그래프 엔지니어링', short: '그래프', stage: '⑥ 그래프',
    desc: '노드·엣지·상태로 StateGraph 엔진을 직접 만들고, LLM 노드와 코드 검증 노드가 섞인 학습계획 워크플로우를 구현합니다.',
    tags: ['StateGraph', '조건부 엣지', '평가-최적화', 'LangGraph 비교'] },
  { file: 'week08-cicd-aws.md', no: 8, title: 'CI/CD 완성 — GitHub Actions → GHCR → AWS EC2', short: 'CI/CD·AWS', stage: '배포',
    desc: '테스트를 통과한 코드만 이미지로 만들어 GHCR에 올리고, EC2에서 Docker Compose로 자동 배포·헬스 체크·롤백합니다.',
    tags: ['GitHub Actions', 'GHCR', 'EC2', 'Secrets', '롤백'] },
  { file: 'week09-portfolio-readme.md', no: 9, title: '포트폴리오 완성 — 한국어 + 일본어 README', short: '포트폴리오', stage: '정리',
    desc: '채용 담당자가 30초에 이해하는 README를 한국어·일본어로 작성하고, 번역 하네스·릴리스·발표·회고로 마무리합니다.',
    tags: ['README', '日本語', '번역 Skill', 'v1.0.0', 'KPT'] },
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const HL_LANG = { tsx: 'typescript', ts: 'typescript', js: 'javascript', mjs: 'javascript', sh: 'bash',
  dotenv: 'ini', gitignore: 'plaintext', text: 'plaintext', txt: 'plaintext', '': 'plaintext' };

const CALLOUT = { '💡': 'tip', '🧪': 'tip', '⚠️': 'warn', '⏱': 'warn', '📌': 'key', '🎓': 'key', '🔐': 'sec', '📖': 'term', '💬': 'speak' };

// 실습 단계 머리표(h4) → 클래스
const STEP = { '🤖': ['step-ai', 'Claude Code 프롬프트'], '⌨️': ['step-cmd', '직접 실행'], '✅': ['step-result', '결과 확인'], '📄': ['step-ref', '참고 코드'] };

function slugify(text, used) {
  let base = text.replace(/<[^>]+>/g, '').toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim().replace(/\s+/g, '-') || 'section';
  let slug = base;
  let i = 2;
  while (used.has(slug)) slug = `${base}-${i++}`;
  used.add(slug);
  return slug;
}

function createMarked(toc) {
  const used = new Set();
  const marked = new Marked();
  marked.use({
    gfm: true,
    extensions: [
      {
        name: 'mathBlock',
        level: 'block',
        start(src) { const i = src.indexOf('$$'); return i < 0 ? undefined : i; },
        tokenizer(src) {
          const m = /^\$\$\n?([\s\S]+?)\n?\$\$[ \t]*(?:\n|$)/.exec(src);
          if (m) return { type: 'mathBlock', raw: m[0], text: m[1].trim() };
          return undefined;
        },
        renderer(token) { return `<div class="math-block">\\[${esc(token.text)}\\]</div>\n`; },
      },
      {
        name: 'mathInline',
        level: 'inline',
        start(src) { const i = src.indexOf('$'); return i < 0 ? undefined : i; },
        tokenizer(src) {
          const m = /^\$(?!\$)((?:\\\$|[^$\n])+?)\$/.exec(src);
          if (m) return { type: 'mathInline', raw: m[0], text: m[1] };
          return undefined;
        },
        renderer(token) { return `<span class="math-inline">\\(${esc(token.text)}\\)</span>`; },
      },
    ],
    walkTokens(token) {
      if (token.type === 'link' && /^[\w.-]+\.md(#.*)?$/.test(token.href)) {
        token.href = token.href.replace(/\.md(#.*)?$/, '.html$1');
      }
    },
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) return `<h1>${inner}</h1>\n`;
        if (depth > 3) return `<h${depth}>${inner}</h${depth}>\n`;
        const id = slugify(text, used);
        toc.push({ depth, id, label: inner.replace(/<[^>]+>/g, '') });
        return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="이 절의 링크">#</a></h${depth}>\n`;
      },
      code({ text, lang }) {
        const l = (lang || '').trim().split(/\s+/)[0];
        if (l === 'mermaid') {
          return `<div class="diagram"><pre class="mermaid">${esc(text)}</pre></div>\n`;
        }
        const hl = HL_LANG[l] ?? l;
        return `<div class="code-block"><div class="code-head"><span>${esc(l || 'text')}</span>` +
          `<button class="copy" type="button">복사</button></div>` +
          `<pre><code class="language-${esc(hl)}">${esc(text)}</code></pre></div>\n`;
      },
    },
  });
  return marked;
}

function postProcess(html) {
  let out = html
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<blockquote>\s*<p>(💡|🧪|⚠️|⏱|📌|🎓|🔐|📖|💬)/gu, (_, emoji) =>
      `<blockquote class="${CALLOUT[emoji] ?? ''}"><p>${emoji}`)
    .replace(/<h4>(🤖|⌨️|✅|📄)\s*([\s\S]*?)<\/h4>/gu, (_, emoji, rest) => {
      const [cls] = STEP[emoji];
      return `<h4 class="step ${cls}"><span class="step-icon">${emoji}</span><span>${rest}</span></h4>`;
    });
  // 🤖 단계 바로 아래의 text 코드 블록은 "Claude Code에 입력할 프롬프트"로 표시
  const parts = out.split(/(?=<h[1-4][ >])/);
  out = parts.map((part) => {
    if (!part.startsWith('<h4 class="step step-ai"')) return part;
    return part.replace(/<div class="code-block"><div class="code-head"><span>text<\/span>/g,
      '<div class="code-block prompt"><div class="code-head"><span>🤖 Claude Code 입력창에 붙여 넣기</span>');
  }).join('');
  return out;
}

function copyImages() {
  const src = path.join(DOCS, 'images');
  if (!fs.existsSync(src)) return;
  const dst = path.join(OUT, 'images');
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
  console.log('✔ images/', fs.readdirSync(src).length);
}

const HEAD_ASSETS = `
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css">
<link rel="stylesheet" href="assets/style.css">`;

const TAIL_SCRIPTS = `
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/contrib/auto-render.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/dockerfile.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/nginx.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/powershell.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/groovy.min.js"></script>
<script defer src="assets/app.js"></script>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose', fontFamily: 'Pretendard, sans-serif' });
  await mermaid.run({ querySelector: 'pre.mermaid' });
</script>`;

function sidebar(activeFile) {
  const items = WEEKS.map((w) => {
    const href = w.file.replace(/\.md$/, '.html');
    const cls = w.file === activeFile ? ' class="active"' : '';
    return `<li><a href="${href}"${cls}>${w.no}주차 · ${esc(w.short)}<small>${esc(w.stage)}</small></a></li>`;
  }).join('\n');
  return `<aside class="sidebar"><h4>강의 목차</h4><ol>
<li><a href="index.html">🏠 과정 소개<small>개요 · 로드맵</small></a></li>
${items}
</ol></aside>`;
}

function topbar(mdHref) {
  return `<header class="topbar">
  ${mdHref ? '<button class="menu-btn" type="button" aria-label="메뉴">☰</button>' : ''}
  <a class="brand" href="index.html">AI <span>Engineering</span> Lab</a>
  <div class="spacer"></div>
  ${mdHref ? `<a class="md-link" href="${mdHref}">📄 Markdown 원본</a>` : ''}
</header>`;
}

function weekPage(week, prev, next) {
  const toc = [];
  const md = fs.readFileSync(path.join(DOCS, week.file), 'utf8');
  let body = postProcess(createMarked(toc).parse(md));
  body = body.replace('</h1>', `</h1>\n<div class="week-hero"><span class="pill">${week.no}주차</span>` +
    `<span class="pill">3시간 (설명 + 실습)</span><span class="pill">${esc(week.stage)}</span></div>`);
  const tocHtml = toc.map((t) => `<a class="h${t.depth}" href="#${t.id}">${t.label}</a>`).join('\n');
  const pager = `<nav class="pager">
  ${prev ? `<a href="${prev.file.replace(/\.md$/, '.html')}"><small>← 이전</small>${prev.no}주차 · ${esc(prev.short)}</a>` : '<a href="index.html"><small>← 처음</small>과정 소개</a>'}
  ${next ? `<a class="next" href="${next.file.replace(/\.md$/, '.html')}"><small>다음 →</small>${next.no}주차 · ${esc(next.short)}</a>` : '<a class="next" href="index.html"><small>완료 🎓</small>과정 소개로</a>'}
</nav>`;
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${week.no}주차 · ${esc(week.title)} | ${esc(COURSE)}</title>
<meta name="description" content="${esc(week.desc)}">
${HEAD_ASSETS}
</head>
<body>
${topbar(`../docs/${week.file}`)}
<div class="layout">
${sidebar(week.file)}
<main class="content">
<article class="paper">
${body}
</article>
${pager}
</main>
<aside class="toc"><h4>이 페이지에서</h4>
${tocHtml}
</aside>
</div>
${TAIL_SCRIPTS}
</body>
</html>
`;
}

function indexPage() {
  const cards = WEEKS.map((w) => `<a class="card" href="${w.file.replace(/\.md$/, '.html')}">
  <span class="num">WEEK ${String(w.no).padStart(2, '0')} · ${esc(w.stage)}</span>
  <h3>${esc(w.title)}</h3>
  <p>${esc(w.desc)}</p>
  <div class="tags">${w.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
</a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(COURSE)}</title>
<meta name="description" content="컴퓨터공학과 2학년 대상 9주(27시간) AI 엔지니어링 특강 교안">
${HEAD_ASSETS}
</head>
<body>
${topbar('')}
<section class="hero">
  <h1>AI와 함께하는 풀스택 개발<br>바이브코딩에서 그래프 엔지니어링까지</h1>
  <p>컴퓨터공학과 2학년 대상 특강 · 3시간 × 9주(27시간) · TypeScript(React) + Spring Boot + MariaDB 프로젝트
  <strong>"AI 스터디 플래너"</strong>를 만들며 AI 엔지니어링 6단계를 이해하고 실습으로 익힙니다.</p>
  <div class="ladder">
    <span>바이브코딩</span><i>→</i><span>프롬프트</span><i>→</i><span>컨텍스트</span><i>→</i>
    <span>하네스</span><i>→</i><span>루프</span><i>→</i><span>그래프</span><i>＋</i><span>CI/CD · AWS</span><i>＋</i><span>README 한·日</span>
  </div>
</section>

<section class="section">
  <h2>📅 주차별 강의</h2>
  <div class="cards">
${cards}
  </div>
</section>

<section class="section">
  <h2>🧭 과정 한눈에 보기</h2>
  <div class="grid2">
    <div class="box">
      <h3>🎯 최종 결과물</h3>
      <ul>
        <li>AWS EC2에 자동 배포된 <strong>AI 스터디 플래너</strong> 웹 서비스</li>
        <li>할 일 · 노트 · AI 요약 · 노트 Q&amp;A(RAG) · AI 코치(루프) · AI 학습계획(그래프)</li>
        <li>Claude Code 하네스(<code>CLAUDE.md</code>, Hooks, Skill, Subagent)와 테스트·CI/CD</li>
        <li>한국어 + 일본어 README 포트폴리오, <code>v1.0.0</code> 릴리스</li>
      </ul>
    </div>
    <div class="box">
      <h3>🛠 기술 스택</h3>
      <ul>
        <li><strong>Frontend</strong> React · Vite · TypeScript</li>
        <li><strong>Backend</strong> Spring Boot 4 · Java 21 · JPA</li>
        <li><strong>DB</strong> MariaDB 11.8 (테스트: H2)</li>
        <li><strong>AI</strong> Claude Code(개발) · Gemini API(앱 내부)</li>
        <li><strong>DevOps</strong> Git · GitHub · Docker · GitHub Actions · GHCR · AWS EC2</li>
      </ul>
    </div>
    <div class="box">
      <h3>⏱ 매주 수업 구성</h3>
      <ul>
        <li><strong>설명</strong> 비유 · 그림 · 도표 · 수식으로 개념 이해</li>
        <li><strong>실습</strong> 따라 하면 동작하는 단계별 코드</li>
        <li><strong>정리</strong> 퀴즈 · 비교표 · 회고 · 과제</li>
        <li><strong>진행 상황 & 다음 주 예고</strong> 지금까지 만든 것과 준비물</li>
        <li><strong>🇯🇵 일본 취업 IT 용어</strong> 주차별 12개 + 면접 예문</li>
      </ul>
    </div>
    <div class="box">
      <h3>📘 자료 사용법</h3>
      <ul>
        <li><strong>🤖 Claude Code 프롬프트</strong> — AI에게 붙여 넣을 지시문</li>
        <li><strong>⌨️ 직접 실행</strong> · <strong>✅ 결과 확인</strong> · <strong>📄 참고 코드</strong> · <strong>📖 용어 풀이</strong></li>
        <li>왼쪽 목차에서 주차 선택, 오른쪽에서 절 이동, 코드는 <strong>복사</strong> 버튼으로</li>
        <li>상단 <strong>Markdown 원본</strong>은 GitHub·노션 업로드용</li>
        <li>인쇄(⌘/Ctrl + P) 시 본문만 깔끔하게 출력</li>
      </ul>
    </div>
  </div>
</section>

<footer class="site">${esc(COURSE)} · 컴퓨터공학과 특강 교안</footer>
${TAIL_SCRIPTS}
</body>
</html>
`;
}

// ── 실행 ──
fs.mkdirSync(OUT, { recursive: true });
WEEKS.forEach((w, i) => {
  const html = weekPage(w, WEEKS[i - 1], WEEKS[i + 1]);
  fs.writeFileSync(path.join(OUT, w.file.replace(/\.md$/, '.html')), html);
  console.log('✔', w.file.replace(/\.md$/, '.html'));
});
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
console.log('✔ index.html');
copyImages();
