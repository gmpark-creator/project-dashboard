(function () {
  const atlas = window.STACK_ATLAS || { unused: [] };
  const groups = atlas.unused || [];
  const allStacks = groups.flatMap(g => (g.items || []).map(item => ({ ...item, groupKey: g.key, groupLabel: g.label })));

  const comboDefs = [
    {
      id: 'edge-ops',
      title: 'AIS Edge Operations',
      project: 'AIS Ship Tracker',
      groups: ['backend', 'database', 'realtime', 'maps', 'devops'],
      use: [
        ['Cloudflare Workers + Hono', 'AIS API 프록시와 항만별 캐시를 엣지에서 처리'],
        ['PostgreSQL + Redis + WebSocket', '항적 저장, 최신 위치 캐시, 관제 화면 실시간 push'],
        ['MapLibre + Turf + deck.gl', '항로 버퍼·위험구역·대량 선박 레이어 시각화']
      ],
      visual: 'map'
    },
    {
      id: 'macro-brain',
      title: 'Premarket Macro Brain',
      project: 'US-KR Premarket Signal',
      groups: ['dataviz', 'aiml', 'database', 'build', 'state'],
      use: [
        ['DuckDB + Pandas/NumPy + SQL', '매크로·시세 시계열 집계와 리밸런싱 계산'],
        ['Hugging Face + LangChain', '뉴스·공시 요약과 자연어 브리핑'],
        ['ECharts + Observable Plot + TanStack Query', '시장 신호 대시보드와 stale data 관리']
      ],
      visual: 'chart'
    },
    {
      id: 'vision-track',
      title: 'DDUIM Vision Track',
      project: 'DDUIM',
      groups: ['aiml', 'gamedev', 'realtime', 'database', 'graphics3d'],
      use: [
        ['OpenCV + TensorFlow.js/MediaPipe', '영상에서 선수·공 후보 검출과 포즈 보정'],
        ['ONNX Runtime + DuckDB', '브라우저/엣지 추론과 프레임별 분석 저장'],
        ['PixiJS + Phaser + WebRTC', '전술 보드 재생과 실시간 관전 데이터 채널']
      ],
      visual: 'field'
    },
    {
      id: 'audio-workbench',
      title: 'INST Audio Workbench',
      project: 'INST Extractor',
      groups: ['audio', 'aiml', 'database', 'mobile', 'devops'],
      use: [
        ['Web Audio API + WaveSurfer.js', '분리 결과 파형·스펙트럼·구간 비교 UI'],
        ['Whisper + librosa + Tone.js', '가사 추출, BPM·키 분석, 메트로놈/연습 기능'],
        ['Tauri + SQLite + Docker', '로컬 GPU 앱 패키징, 작업 이력, 환경 재현']
      ],
      visual: 'audio'
    },
    {
      id: 'knowledge-graph',
      title: 'Knowledgeverse Graph Studio',
      project: 'Knowledgeverse',
      groups: ['frontend', 'dataviz', 'state', 'testing', 'assets'],
      use: [
        ['D3.js + visx + Recharts', '공급망·개념 관계 그래프와 보조 차트'],
        ['shadcn/ui + Radix + Jotai/XState', '패널·모달·선택 상태를 명확한 상태기계로 분리'],
        ['Storybook + Iconify + Variable Fonts', '컴포넌트 카탈로그, 아이콘 표준화, 다국어 타이포']
      ],
      visual: 'graph'
    },
    {
      id: 'webgpu-space',
      title: 'Solar WebGPU Lab',
      project: 'Solar System Simulator',
      groups: ['lang', 'graphics3d', 'gamedev', 'assets', 'devops'],
      use: [
        ['Rust + WGSL + WebGPU', '천체력·입자 계산을 WASM/GPU 파이프라인으로 분리'],
        ['Three postprocessing + Rapier', '렌즈 플레어·충돌/궤도 물리 실험'],
        ['Blender + Spline + glTF DRACO/KTX2', '압축된 3D 탐사선·행성 자산 파이프라인']
      ],
      visual: 'orbit'
    },
    {
      id: 'gov-multiplayer',
      title: 'Korea Gov Sim Multiplayer',
      project: '2026 PRESIDENT KOREA',
      groups: ['realtime', 'database', 'mobile', 'gamedev', 'testing', 'state'],
      use: [
        ['Socket.IO + Supabase/Firebase', '멀티플레이 룸·리더보드·세이브 동기화'],
        ['Godot + Flutter + React Native', '웹 export와 모바일 companion 앱 후보'],
        ['Redux Toolkit + Vitest + Testing Library', '게임 상태와 정책 UI 회귀 테스트']
      ],
      visual: 'command'
    },
    {
      id: 'delivery-system',
      title: 'Monorepo Delivery Control',
      project: 'Project Dashboard',
      groups: ['build', 'testing', 'devops', 'backend', 'lang'],
      use: [
        ['pnpm workspace + Turborepo', '프로젝트별 미리보기 빌드와 공유 패키지 캐시'],
        ['Bun + Deno + Node/Fastify', '데이터 갱신 스크립트와 경량 API 런타임 비교'],
        ['GitHub Actions + Biome + Sentry', '자동 품질 게이트와 배포 후 오류 수집']
      ],
      visual: 'pipeline'
    },
    {
      id: 'immersive-gis',
      title: 'Immersive GIS Twin',
      project: 'TradeLogix / Logistics',
      groups: ['maps', 'graphics3d', 'dataviz', 'backend', 'database'],
      use: [
        ['Cesium + 3D Tiles + OpenLayers', '항만·창고·도시 단위 디지털 트윈'],
        ['Babylon.js + Spline', '물류 장비·컨테이너 yard 3D 씬'],
        ['NestJS/Django + PostgreSQL', '통관·창고 이벤트 API와 운영 데이터 저장']
      ],
      visual: 'globe'
    },
    {
      id: 'motion-web',
      title: 'JP Global Motion System',
      project: 'Frontend & Tone Atelier',
      groups: ['frontend', 'animation', 'assets', 'build'],
      use: [
        ['Astro + SvelteKit + Vue/Nuxt', '정적 콘텐츠·인터랙션·관리형 페이지 후보 비교'],
        ['GSAP + Lottie + Motion One', '스크롤 시퀀스, 아이콘 모션, 경량 마이크로 인터랙션'],
        ['Vite + Variable Fonts', '바닐라 프로젝트의 self-host 번들·타이포 실험']
      ],
      visual: 'motion'
    }
  ];

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
  function groupItems(key) {
    return (groups.find(g => g.key === key) || { items: [] }).items || [];
  }
  function stacksForCombo(combo) {
    return combo.groups.flatMap(groupItems).map(i => i.name);
  }
  function visual(type) {
    if (type === 'map') return '<svg viewBox="0 0 420 168"><path d="M36 112 C108 38 188 132 274 58 S374 88 398 44" fill="none" stroke="#38bdf8" stroke-width="4"/><g fill="#34d399"><circle cx="74" cy="90" r="9"/><circle cx="176" cy="112" r="7"/><circle cx="276" cy="58" r="10"/><circle cx="366" cy="70" r="8"/></g><path d="M20 132h380" stroke="#334155"/><text x="26" y="34" fill="#e5edf8" font-size="18" font-weight="800">EDGE AIS STREAM</text></svg>';
    if (type === 'chart') return '<svg viewBox="0 0 420 168"><g stroke="#334155"><path d="M34 26v112h350"/><path d="M34 104h350"/><path d="M34 70h350"/></g><path d="M40 120 L92 94 L142 108 L196 52 L248 78 L300 38 L372 64" fill="none" stroke="#34d399" stroke-width="5"/><circle cx="300" cy="38" r="9" fill="#fbbf24"/><text x="42" y="30" fill="#e5edf8" font-size="16" font-weight="800">MACRO SIGNAL</text></svg>';
    if (type === 'field') return '<svg viewBox="0 0 420 168"><rect x="32" y="24" width="356" height="120" rx="10" fill="#0f5132" stroke="#34d399"/><path d="M210 24v120M32 84h356" stroke="#b7f7ec" opacity=".5"/><circle cx="210" cy="84" r="26" fill="none" stroke="#b7f7ec" opacity=".5"/><g fill="#f8fafc"><circle cx="88" cy="62" r="6"/><circle cx="122" cy="102" r="6"/><circle cx="280" cy="72" r="6"/><circle cx="318" cy="112" r="6"/></g><circle cx="250" cy="92" r="4" fill="#fbbf24"/></svg>';
    if (type === 'audio') return '<svg viewBox="0 0 420 168"><g fill="#38bdf8" opacity=".9"><rect x="36" y="76" width="12" height="28" rx="6"/><rect x="60" y="56" width="12" height="68" rx="6"/><rect x="84" y="36" width="12" height="108" rx="6"/><rect x="108" y="66" width="12" height="48" rx="6"/></g><path d="M150 84 C188 24 228 144 264 84 S338 24 386 84" fill="none" stroke="#f472b6" stroke-width="5"/><text x="36" y="28" fill="#e5edf8" font-size="16" font-weight="800">AUDIO STEM LAB</text></svg>';
    if (type === 'graph') return '<svg viewBox="0 0 420 168"><g stroke="#64748b" stroke-width="2"><path d="M80 82L160 46L230 92L318 54M160 46L210 132M230 92L318 54L350 122"/></g><g fill="#a78bfa"><circle cx="80" cy="82" r="14"/><circle cx="160" cy="46" r="18"/><circle cx="230" cy="92" r="15"/><circle cx="318" cy="54" r="18"/><circle cx="210" cy="132" r="12"/><circle cx="350" cy="122" r="13"/></g></svg>';
    if (type === 'orbit') return '<svg viewBox="0 0 420 168"><circle cx="210" cy="84" r="18" fill="#fbbf24"/><g fill="none" stroke="#64748b"><ellipse cx="210" cy="84" rx="72" ry="28"/><ellipse cx="210" cy="84" rx="120" ry="48"/><ellipse cx="210" cy="84" rx="170" ry="70"/></g><circle cx="282" cy="84" r="8" fill="#38bdf8"/><circle cx="92" cy="84" r="6" fill="#a78bfa"/><text x="28" y="28" fill="#e5edf8" font-size="16" font-weight="800">WEBGPU ORBITS</text></svg>';
    if (type === 'command') return '<svg viewBox="0 0 420 168"><rect x="36" y="28" width="348" height="112" rx="12" fill="#111827" stroke="#fbbf24"/><path d="M62 58h120M62 84h80M62 110h150" stroke="#e5edf8" stroke-width="8" opacity=".75"/><g fill="#34d399"><circle cx="292" cy="62" r="15"/><circle cx="332" cy="92" r="15"/><circle cx="278" cy="112" r="15"/></g></svg>';
    if (type === 'pipeline') return '<svg viewBox="0 0 420 168"><g fill="#111827" stroke="#38bdf8"><rect x="34" y="60" width="70" height="48" rx="8"/><rect x="136" y="60" width="70" height="48" rx="8"/><rect x="238" y="60" width="70" height="48" rx="8"/><rect x="340" y="60" width="46" height="48" rx="8"/></g><path d="M104 84h32M206 84h32M308 84h32" stroke="#34d399" stroke-width="4"/><text x="42" y="36" fill="#e5edf8" font-size="16" font-weight="800">BUILD PIPELINE</text></svg>';
    if (type === 'globe') return '<svg viewBox="0 0 420 168"><circle cx="210" cy="84" r="62" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/><path d="M150 84h120M210 22v124M170 34c28 28 28 72 0 100M250 34c-28 28-28 72 0 100" stroke="#38bdf8" fill="none" opacity=".6"/><path d="M116 116 C180 44 260 136 332 52" stroke="#fbbf24" stroke-width="4" fill="none"/><circle cx="332" cy="52" r="8" fill="#fbbf24"/></svg>';
    return '<svg viewBox="0 0 420 168"><path d="M44 116 C90 40 148 144 200 78 S318 38 380 96" fill="none" stroke="#a78bfa" stroke-width="5"/><g fill="#34d399"><circle cx="74" cy="84" r="8"/><circle cx="200" cy="78" r="8"/><circle cx="326" cy="62" r="8"/></g><text x="36" y="34" fill="#e5edf8" font-size="16" font-weight="800">MOTION SYSTEM</text></svg>';
  }

  function renderFilters() {
    $('groupFilters').innerHTML = '<button class="filter is-active" data-group="all">ALL</button>' +
      groups.map(g => `<button class="filter" data-group="${esc(g.key)}">${esc(g.label.split(' ')[0])} · ${(g.items || []).length}</button>`).join('');
    $('groupFilters').addEventListener('click', e => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      document.querySelectorAll('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
      state.group = btn.dataset.group;
      applyFilters();
    });
  }

  function renderCombos() {
    $('comboGrid').innerHTML = comboDefs.map((c, idx) => {
      const stacks = stacksForCombo(c);
      return `<article class="combo-card" data-groups="${c.groups.join(' ')}" data-search="${esc((c.title + ' ' + c.project + ' ' + stacks.join(' ')).toLowerCase())}">
        <div class="combo-visual">${visual(c.visual)}</div>
        <div class="combo-body">
          <div class="combo-top">
            <div><span class="combo-kicker">combo ${String(idx + 1).padStart(2, '0')}</span><h3 class="combo-title">${esc(c.title)}</h3></div>
            <span class="combo-project">${esc(c.project)}</span>
          </div>
          <div class="stack-chips">${stacks.slice(0, 12).map(s => `<span class="chip">${esc(s)}</span>`).join('')}${stacks.length > 12 ? `<span class="chip">+${stacks.length - 12}</span>` : ''}</div>
          <div class="part-list">${c.use.map(([stack, where]) => `<div class="part"><b>${esc(stack)}</b><span>${esc(where)}</span></div>`).join('')}</div>
        </div>
      </article>`;
    }).join('');
  }

  function renderMatrix() {
    $('stackMatrix').innerHTML = groups.map(g => `<article class="matrix-card" data-group="${esc(g.key)}">
      <div class="matrix-head"><h3>${esc(g.label)}</h3><span>${String((g.items || []).length).padStart(2, '0')}</span></div>
      ${(g.items || []).map(item => `<div class="stack-row" data-search="${esc((item.name + ' ' + item.recommendation + ' ' + (item.fitProjects || []).join(' ')).toLowerCase())}">
        <div class="stack-name">${esc(item.name)}</div>
        <p class="stack-rec">${esc(item.recommendation)}</p>
        <div class="fit-list">${(item.fitProjects || []).map(p => `<span class="fit">${esc(p)}</span>`).join('')}</div>
      </div>`).join('')}
    </article>`).join('');
  }

  const state = { group: 'all', q: '' };
  function applyFilters() {
    state.q = ($('stackSearch').value || '').trim().toLowerCase();
    document.querySelectorAll('.matrix-card').forEach(card => {
      const groupOk = state.group === 'all' || card.dataset.group === state.group;
      let any = false;
      card.querySelectorAll('.stack-row').forEach(row => {
        const qOk = !state.q || row.dataset.search.includes(state.q);
        row.classList.toggle('hidden', !(groupOk && qOk));
        if (groupOk && qOk) any = true;
      });
      card.classList.toggle('hidden', !any);
    });
    document.querySelectorAll('.combo-card').forEach(card => {
      const groupOk = state.group === 'all' || card.dataset.groups.split(' ').includes(state.group);
      const qOk = !state.q || card.dataset.search.includes(state.q);
      card.classList.toggle('hidden', !(groupOk && qOk));
    });
  }

  function renderMetrics() {
    $('metricGroups').textContent = groups.length;
    $('metricStacks').textContent = allStacks.length;
    $('metricCombos').textContent = comboDefs.length;
    $('coverageCount').textContent = `${allStacks.length}/${allStacks.length}`;
    $('coverageBar').style.width = '100%';
  }

  function drawSignal() {
    const canvas = $('signalCanvas');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(320 * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = 320;
    let t = 0;
    function frame() {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0c1222';
      ctx.fillRect(0, 0, w, h);
      const lanes = groups.slice(0, 18);
      lanes.forEach((g, i) => {
        const y = 28 + (i % 9) * 30 + (i > 8 ? 10 : 0);
        const x0 = i > 8 ? w * .52 : 22;
        const x1 = i > 8 ? w - 28 : w * .48;
        ctx.strokeStyle = `hsla(${170 + i * 11}, 78%, 62%, .28)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.bezierCurveTo(x0 + 90, y - 30, x1 - 90, y + 30, x1, y);
        ctx.stroke();
        const p = (Math.sin(t + i * .41) + 1) / 2;
        const cx = x0 + (x1 - x0) * p;
        const cy = y + Math.sin(p * Math.PI * 2) * 16;
        ctx.fillStyle = `hsla(${170 + i * 11}, 88%, 68%, .95)`;
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = '#e5edf8';
      ctx.font = '800 13px system-ui';
      ctx.fillText('UNUSED STACKS', 22, 22);
      ctx.fillText('REFERENCE SURFACES', w - 170, 22);
      requestAnimationFrame(frame);
    }
    frame();
  }

  function init() {
    renderMetrics();
    renderFilters();
    renderCombos();
    renderMatrix();
    $('stackSearch').addEventListener('input', applyFilters);
    drawSignal();
  }
  init();
})();
