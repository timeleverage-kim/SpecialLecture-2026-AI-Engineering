// AI 엔지니어링 특강 — 강의 자료 공통 스크립트
(function () {
  // 1) 코드 복사 버튼
  document.querySelectorAll('.code-block .copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.closest('.code-block').querySelector('pre code');
      var text = code ? code.innerText : '';
      var done = function () {
        btn.textContent = '복사됨 ✓';
        setTimeout(function () { btn.textContent = '복사'; }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } finally { document.body.removeChild(ta); }
      }
    });
  });

  // 2) 모바일 메뉴
  var menu = document.querySelector('.menu-btn');
  if (menu) {
    menu.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
    document.querySelectorAll('.sidebar a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  // 3) 현재 읽는 절을 목차에 표시
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (l) { l.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-60px 0px -70% 0px' });
    document.querySelectorAll('.paper h2[id], .paper h3[id]').forEach(function (h) { observer.observe(h); });
  }

  // 4) 코드 하이라이트 (highlight.js가 로드된 경우)
  if (window.hljs) {
    document.querySelectorAll('.code-block pre code').forEach(function (el) {
      if (!el.classList.contains('language-plaintext')) {
        window.hljs.highlightElement(el);
      }
    });
  }

  // 5) 수식 (KaTeX auto-render가 로드된 경우)
  if (window.renderMathInElement) {
    window.renderMathInElement(document.querySelector('.paper') || document.body, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      ignoredClasses: ['code-block', 'mermaid'],
      throwOnError: false,
      strict: false,
    });
  }
})();
