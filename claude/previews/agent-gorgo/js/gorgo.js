/* =========================================================================
   에이전트 고르고 — 2D 치비 캐릭터 (오리지널 도트, 16×21)
   네이비 수트 · 빨간 넥타이 · 머리 위에 걸친 선글라스 · 반짝이는 눈
   ========================================================================= */
(function (G) {
  'use strict';
  const PAL = {
    k: '#2b2036', h: '#33294d', H: '#6a5d96', s: '#ffe2c9', S: '#f4b996', c: '#ff9aab',
    e: '#2b2036', W: '#ffffff', m: '#d4566a', g: '#1f1d33', G: '#86e0ff',
    w: '#ffffff', r: '#ee4458', j: '#3d4f86', J: '#2b3866', p: '#2d3458', b: '#5a3a2c',
  };

  const HEAD_DOWN = [
    '.....kkkkkk.....',
    '...kkhhhhhhkk...',
    '..khhHHhhhhhhk..',
    '.khHhhhhhhhhhhk.',
    '.kgGgggkkgGgggk.',
    '.khsssssssssshk.',
    '.kssssssssssssk.',
    '.kssWessssWessk.',
    '.ksseesssseessk.',
    '.ksccssmmssccsk.',
    '.kSssssssssssSk.',
    '..kkSSSSSSSSkk..',
  ];
  const BODY_DOWN = [
    '..kjjjwrrwjjjk..',
    '.kjjjjwrrwjjjjk.',
    '.ksjjjjrrjjjjsk.',
    '.kSJjjjrrjjjJSk.',
    '..kJJJJJJJJJJk..',
  ];
  const HEAD_UP = [
    '.....kkkkkk.....',
    '...kkhhhhhhkk...',
    '..khhHHhhhhhhk..',
    '.khHhhhhhhhhhhk.',
    '.kghhhhhhhhhhgk.',
    '.khhhhhhhhhhhhk.',
    '.khhhhHhhhhhhhk.',
    '.khhhHhhhhhhhhk.',
    '.khhhhhhhhhhhhk.',
    '.kShhhhhhhhhhSk.',
    '.kShhhhhhhhhhSk.',
    '..kkhhhhhhhhkk..',
  ];
  const BODY_UP = [
    '..kjjjjjjjjjjk..',
    '.kjjjjjjjjjjjjk.',
    '.ksjjjjjJjjjjsk.',
    '.kSJjjjjJjjjJSk.',
    '..kJJJJJJJJJJk..',
  ];
  const HEAD_SIDE = [
    '.....kkkkkk.....',
    '...kkhhhhhhkk...',
    '..khhHHhhhhhhk..',
    '.khHhhhhhhhhhhk.',
    '.khhhhhhhhgGggk.',
    '.khhhhhhssssssk.',
    '.khhhSShssssssk.',
    '.khhhSSssssWesk.',
    '.khhhsssssseesk.',
    '.khhhsssssccssk.',
    '.khhsssssssssmk.',
    '..kkhSSSSSSSkk..',
  ];
  const BODY_SIDE = [
    '...kjjjjjwrk....',
    '...kjjjjjjwk....',
    '...kjJJjjjrk....',
    '...kjsSjjjjk....',
    '...kJJJJJJJk....',
  ];
  const LEGS = {
    stand: ['...kpppkkpppk...', '...kpppkkpppk...', '..kbbbbkkbbbbk..', '..kkkkk..kkkkk..'],
    stepA: ['...kpppkkpppk...', '..kbbbbkkpppk...', '..kkkkk.kbbbbk..', '.........kkkkk..'],
    stepB: ['...kpppkkpppk...', '...kpppkkbbbbk..', '..kbbbbk.kkkkk..', '..kkkkk.........'],
    sStand: ['....kpppppk.....', '....kpppppk.....', '....kbbbbbbk....', '....kkkkkkkk....'],
    sStepA: ['...kpppppppk....', '..kppk..kppk....', '.kbbbk..kbbbbk..', '.kkkk...kkkkk...'],
    sStepB: ['...kpppppppk....', '...kpppkppk.....', '..kbbbkkbbbk....', '..kkkkkkkkk.....'],
  };

  function validate(name, rows) {
    rows.forEach((r, i) => { if (r.length !== 16) console.warn('[gorgo] 폭 오류', name, i, r.length, r); });
  }

  function render(rows, mirror) {
    const c = document.createElement('canvas'); c.width = 16; c.height = rows.length;
    const x = c.getContext('2d');
    rows.forEach((row, y) => {
      for (let i = 0; i < 16; i++) {
        const ch = row[i]; if (ch === '.' || !PAL[ch]) continue;
        x.fillStyle = PAL[ch]; x.fillRect(mirror ? 15 - i : i, y, 1, 1);
      }
    });
    return c;
  }
  const blinkify = (head) => head.map((r, i) => i === 7 ? r.replace(/[We]/g, 's') : i === 8 ? r.replace(/e/g, 'k') : r);

  function build() {
    const frames = {}; // frames[dir][blink?1:0][frameIdx]
    const defs = {
      down: { head: HEAD_DOWN, body: BODY_DOWN, legs: ['stand', 'stepA', 'stand', 'stepB'] },
      up: { head: HEAD_UP, body: BODY_UP, legs: ['stand', 'stepA', 'stand', 'stepB'] },
      right: { head: HEAD_SIDE, body: BODY_SIDE, legs: ['sStand', 'sStepA', 'sStand', 'sStepB'] },
    };
    for (const [dir, d] of Object.entries(defs)) {
      validate(dir + '.head', d.head); validate(dir + '.body', d.body);
      const mk = (head, mirror) => d.legs.map(l => { validate(l, LEGS[l]); return render([...head, ...d.body, ...LEGS[l]], mirror); });
      frames[dir] = [mk(d.head, false), mk(dir === 'up' ? d.head : blinkify(d.head), false)];
      if (dir === 'right') frames.left = [mk(d.head, true), mk(blinkify(d.head), true)];
    }
    return frames;
  }

  G.Gorgo = { build, W: 16, H: 21, PAL };
})(window);
